import { Type } from "gtools";
import { GLogger } from "gtools/GUtils";
import { EcsComponent } from "../old/ecs-component";
import { EcsComponentParams } from "./ecs-component";
import { EcsEngine } from "./ecs-engine";
import { EcsEntity } from "./ecs-entity";
import { EcsFamily } from "./ecs-family";
import { EcsSystem, EcsSystemParams } from "./ecs-system";
import { FamilyParams } from "./family-params";

interface EcsComponentData {
    readonly params: EcsComponentParams;
    readonly type: Type;
}

interface EcsSystemData {
    readonly params: EcsSystemParams;
    readonly type: string | Type;
}


class EcsMarker {
    public readonly componentSymbol = Symbol.for("ECS_COMPONENT_IDENTIFIER");
    public readonly engineSymbol    = Symbol.for("ECS_ENGINE_IDENTIFIER");
    public readonly systemSymbol    = Symbol.for("ECS_SYSTEM_IDENTIFIER");
    public readonly familySymbol    = Symbol.for("ECS_FAMILY_IDENTIFIER");
    public readonly entitySymbol    = "id";
    private componentCounter        = 1;
    private systemCounter           = 1;
    private familyCounter           = 1;
    private entityCounter           = 1;
    private engineCounter           = 1;

    public markEntity(entity: EcsEntity): void {
        Object.defineProperty(entity, this.entitySymbol, {value: this.entityCounter++});
    }

    public isEntity(entity: any): entity is EcsEntity {
        return this.entitySymbol in entity;
    }

    public markSystem(entity: any): void {
        Object.defineProperty(entity, this.systemSymbol, {value: this.systemCounter++});
    }

    public isSystem(system: any): system is EcsSystem {
        return this.systemSymbol in system;
    }

    public markSystemInstance(system: any): void {
        Object.defineProperty(system, this.systemSymbol, {value: this.systemCounter++});
    }

    public markFamilyInstance(family: any): void {
        Object.defineProperty(family, this.familySymbol, {value: this.familyCounter++});
    }

    public markComponentInstance(component: any): void {
        Object.defineProperty(component, this.componentSymbol, {value: this.componentCounter++});
    }

    public isComponent(component: any): component is EcsComponent {
        return this.componentSymbol in component;
    }

    public markEngineInstance(engine: any): void {
        Object.defineProperty(engine, this.engineSymbol, {value: this.engineCounter++});
    }
}

class EcsHolder {
    public readonly marker = new EcsMarker();

    protected readonly logger                     = GLogger.createClassLogger(this);
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

    public createFamily(
        system: EcsSystem,
        familyParams: FamilyParams & { propertyName?: string },
        propertyName = familyParams.propertyName ?? "family",
    ): EcsFamily {
        this.logger.log("Creating family " + propertyName + " to object " + system);
        const family = new EcsFamily(system.constructor.name + "." + propertyName, familyParams);

        this.marker.markFamilyInstance(family);

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

        this.marker.markEngineInstance(instance);

        return instance as T;
    }

    public validateEngine<T extends EcsEngine>(engine: T): boolean {
        return true;
    }

    // SYSTEM

    public registerSystemData(component: EcsSystemData): void {
        console.assert(!this.marker.isSystem(component), "System can be registered only from decorator");

        this.marker.markSystem(component);

        this.systemData.set((component.type as any).name, component);
    }

    public getSystemData(type: string): EcsSystemData | undefined {
        return this.systemData.get(type);
    }

    public createSystemInstance<T, S extends new (...args: any[]) => T>(type: S, ...params: ConstructorParameters<S>): T {
        console.assert(this.systemData.has((type as any).name), "System must be marked via decorator");

        const instance = new type(...params);

        this.marker.markSystemInstance(instance);

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

        this.marker.markEntity(result);

        this.createdEntities.push(result);


        return result;
    }

    public destroyEntity<T extends EcsEntity>(entity: T): void {
        console.assert(this.marker.isEntity(entity), "Only entity can by destroyed");

        const index = this.createdEntities.findIndex((e) => e.id === entity.id);

        entity.forEachComponent((c) => this.destroyComponent(c));

        this.createdEntities.splice(index, 1);
    }

    // COMPONENT

    public registerComponentData(component: EcsComponentData): void {
        this.componentData.set((component.type as any).name, component);
    }

    public destroyComponent<T = any>(component: T): void {
        console.assert(this.marker.isComponent(component), "Only component can by destroyed");

        const instances = this.componentInstances.get((component as any).constructor);

        if (!instances) {
            throw new Error("Cannot destroy not created component");
        }

        const instanceIndex = instances.indexOf(component);

        console.assert(instanceIndex >= 0, "Instance must exists");

    }

    public createComponent<T, S extends new (...args: any[]) => T>(type: S, ...params: ConstructorParameters<S>): T {
        console.assert(this.componentData.has((type as any).name), "Component must be marked via decorator");

        const instance = new type(...params);

        this.registerComponentInstance(instance);

        return instance;
    }

    public getComponentData(type: Type): EcsComponentData | undefined {
        return this.componentData.get((type as any).name);
    }

    public registerComponentInstance<T>(component: T): void {
        const type = (component as any).constructor;
        this.marker.markComponentInstance(component);

        const instances = this.componentInstances.get(type);
        if (instances) {
            instances.push(component);
        } else {
            this.componentInstances.set(type, [component]);
        }
    }
}

export const Ecs = new EcsHolder();
