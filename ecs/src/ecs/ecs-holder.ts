import type { Type } from "gtools";
import type { EcsComponentParams } from "./ecs-component";
import type { EcsEngine } from "./ecs-engine";
import { EcsEntity } from "./ecs-entity";
import { EcsFamily } from "./ecs-family";
import { EcsMarker } from "./ecs-marker";
import { EcsLogger } from "./ecs-setup";
import type { EcsSystem, EcsSystemParams } from "./ecs-system";
import type { FamilyParams } from "./family-params";

interface EcsComponentData {
    readonly params: EcsComponentParams;
    readonly type: Type;
}

interface EcsSystemData {
    readonly params: EcsSystemParams;
    readonly type: string | Type;
}


class EcsHolder {
    protected readonly logger                     = EcsLogger.extends(this);
    private readonly componentData                = new Map<string, EcsComponentData>();
    private readonly systemData                   = new Map<string, EcsSystemData>();
    private readonly createdEntities: EcsEntity[] = [];
    private readonly familyMap                    = new Map<string, EcsFamily[]>();
    private readonly componentInstances           = new Map<new (...args: any[]) => any, unknown[]>();


    public toString(): string {
        const data = [
            `Registered systems: ${this.systemData.size}`,
            `Registered family types: ${this.familyMap.size}`,
            `Created entities: ${this.createdEntities.length}`,
            `Registered component instances: ${this.componentInstances.size}`,
        ];

        return data.join("\n");
    }

    public cleanUp(): void {
        this.createdEntities.forEach((e) => this.destroyEntity(e));
        console.assert(this.createdEntities.length === 0, "All entities should be removed");

        this.createdEntities.splice(0, this.createdEntities.length);
        this.componentData.clear();
        this.systemData.clear();
        this.familyMap.clear();
        this.componentInstances.clear();
    }

    // FAMILY

    public getFamilies(system: EcsSystem): EcsFamily[] {
        return this.familyMap.get(system.constructor.name) || [];
    }

    public registerSystemBind(
        system: EcsSystem,
        systemToBind: Type<any>,
        propertyName: string,
    ): void {
        this.logger.log("Registering bind property " + propertyName + " to object " + system.constructor.name);
        debugger;
    }

    public createFamily(
        system: EcsSystem,
        familyParams: FamilyParams & { propertyName?: string },
        propertyName = familyParams.propertyName ?? "family",
    ): EcsFamily {
        this.logger.log("Creating family " + propertyName + " to object " + system);
        const family = new EcsFamily(system.constructor.name + "." + propertyName, familyParams);

        EcsMarker.markFamilyInstance(family);

        const entry = this.familyMap.get(system.constructor.name);
        if (entry) {
            entry.push(family);
        } else {
            this.familyMap.set(system.constructor.name, [family]);
        }

        const descriptor = {
            value: family,
        };
        Object.defineProperty(system, propertyName, descriptor);

        return family;
    }


    // ENGINE

    public createEngineInstance<T, S extends new (...args: any[]) => T>(type: S, ...params: ConstructorParameters<S>): T {
        const instance = new type(...params);

        EcsMarker.markEngineInstance(instance);

        return instance as T;
    }

    public validateEngine<T extends EcsEngine>(engine: T): boolean {
        return true;
    }

    // SYSTEM

    public registerSystemData(component: EcsSystemData): void {
        console.assert(!EcsMarker.isSystem(component), "System can be registered only from decorator");

        EcsMarker.markSystem(component);

        this.systemData.set((component.type as any).name, component);
    }

    public getSystemData(type: string): EcsSystemData | undefined {
        return this.systemData.get(type);
    }

    public createSystemInstance<T, S extends new (...args: any[]) => T>(type: S, ...params: ConstructorParameters<S>): T {
        console.assert(this.systemData.has((type as any).name), "System must be marked via decorator");

        const instance = new type(...params);

        EcsMarker.markSystemInstance(instance);

        return instance;
    }

    // ENTITY

    public createEntity(...components: any[]): EcsEntity {
        const result = new EcsEntity();

        components.forEach((component) => result.add(component));

        components.forEach((component) => {
            const data         = this.componentData.get(component.constructor.name);
            const dependencies = data?.params.dependencies;
            if (Array.isArray(dependencies)) {
                const missingDependency = dependencies.find((c) => !result.hasComponent(c));
                if (missingDependency) {
                    throw new Error(`Component ${missingDependency.name} required by ${component.constructor.name} is not provided`);
                }
            }
        });

        EcsMarker.markEntity(result);

        this.createdEntities.push(result);


        return result;
    }

    public destroyEntity<T extends EcsEntity>(entity: T): void {
        console.assert(EcsMarker.isEntity(entity), "Only entity can by destroyed");

        const index = this.createdEntities.findIndex((e) => e.id === entity.id);

        entity.forEachComponent((c) => this.destroyComponent(c));

        this.createdEntities.splice(index, 1);
    }

    // COMPONENT

    public registerComponentData(component: EcsComponentData): void {
        this.componentData.set((component.type as any).name, component);
    }

    public destroyComponent<T = any>(component: T): void {
        console.assert(EcsMarker.isComponent(component), "Only component can by destroyed");

        const instances = this.componentInstances.get((component as any).constructor);

        if (!instances) {
            throw new Error("Cannot destroy not created component");
        }

        const instanceIndex = instances.indexOf(component);

        console.assert(instanceIndex >= 0, "Instance must exists");

    }

    public createComponentInstance<T, S extends new (...args: any[]) => T>(type: S, ...params: ConstructorParameters<S>): T {
        const componentName = (type as any).name;
        console.assert(this.componentData.has(componentName), "Component " + componentName + " must be marked via decorator");

        const instance = new type(...params);

        this.registerComponentInstance(instance);

        return instance;
    }

    public getComponentData(type: Type): EcsComponentData | undefined {
        return this.componentData.get((type as any).name);
    }

    public registerComponentInstance<T>(component: T): void {
        const type = (component as any).constructor;
        EcsMarker.markComponentInstance(component);

        const instances = this.componentInstances.get(type);
        if (instances) {
            instances.push(component);
        } else {
            this.componentInstances.set(type, [component]);
        }
    }
}

export const Ecs = new EcsHolder();
