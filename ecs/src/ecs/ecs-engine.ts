import { Type } from "gtools";
import { GLogger } from "gtools/GUtils";
import { EcsEngineMode } from "./ecs-engine-mode";
import { EcsEntity } from "./ecs-entity";
import { EcsEntityManager } from "./ecs-entity-manager";
import { EcsFamily } from "./ecs-family";
import { Ecs } from "./ecs-holder";
import { EcsEntityListener, EcsEntitySystemListener } from "./ecs-listeners";
import { EcsMarker } from "./ecs-marker";
import { EcsSystem } from "./ecs-system";
import { EcsSystemManager } from "./ecs-system-manager";
import { EcsSystemMode } from "./ecs-system-mode";

abstract class AbstractEcsEngine {
    public readonly id                                                                           = "ECS_ENGINE_" + Date.now() + "_" + Math.random();
    protected readonly logger                                                                    = GLogger.createClassLogger(this);
    protected readonly families: EcsFamily[]                                                     = [];
    private readonly listener: EcsEntityListener<EcsEntity> & EcsEntitySystemListener<EcsSystem> = {
        entityRemoved: (entity: EcsEntity) => this.removeEntityInternally(entity),
        entityAdded  : (entity: EcsEntity) => this.addEntityInternally(entity),
        systemRemoved: (system: EcsSystem) => this.removeSystemInternally(system),
        systemAdded  : (system: EcsSystem) => this.addSystemInternally(system),
    }
    protected readonly systems                                                                   = new EcsSystemManager<EcsSystem & { name?: string }>(this.listener);
    protected readonly entities                                                                  = new EcsEntityManager<EcsEntity>(this.listener);

    public get systemsLength(): number {
        return this.systems.length;
    }

    public get entitiesLength(): number {
        return this.entities.length;
    }

    public cleanUp(): void {
        this.systems.removeAllSystems();
        this.entities.removeAllEntities();
    }

    public addEntityInternally(entity: EcsEntity): void {
        this.logger.log(`Adding ${entity}`);
        this.families.forEach((family) => family.onEntityAdd(entity));
        this.systems.forEach((system) => {
            if (typeof system.onEntityAdded === "function") {
                system.onEntityAdded(entity);
            }
        });
    }

    public check(): void {
        this.logger.log("Checking families");
        this.families.forEach((family) => family.check());

        this.systems.forEach((system) => {
            const systemName = system.constructor.name;
            const systemData = Ecs.getSystemData(systemName);

            if (Array.isArray(systemData.params.require)) {
                const missingSystems = systemData.params.require.filter((s) => !this.getSystem(s)).map((e) => e.name);

                if (missingSystems.length) {
                    throw new Error("System " + systemName + " has missing dependencies: " + missingSystems.join(", "));
                }
            }
        });
    }

    public getSystem<T extends EcsSystem>(system: Type<T>): T | undefined {
        return this.systems.findSystemByInstance(system as any);
    }

    protected removeEntityInternally(entity: EcsEntity): void {
        this.logger.log(`Removing ${entity}`);
        this.families.forEach((family) => family.onEntityRemove(entity));
        this.systems.forEach((system) => {
            if (typeof system.onEntityRemoved === "function") {
                system.onEntityRemoved(entity);
            }
        });
    }

    protected addFamilyInternally(family: EcsFamily): void {
        this.logger.log(`Adding ${family}`);
        this.families.push(family);

        this.entities.getEntities().forEach((entity) => family.onEntityAdd(entity));
    }

    protected removeFamilyInternally(family: EcsFamily): void {
        this.logger.log(`Removing ${family}`);
        const index = this.families.findIndex((f) => f.id === family.id);

        if (index < 0) {
            return;
        }

        this.families.splice(index, 1);
    }

    protected addSystemInternally(system: EcsSystem): void {
        this.logger.log("Adding [EcsSystem]", system.constructor.name);

        const systemData = Ecs.getSystemData(system.constructor.name);

        if (systemData) {
            if (systemData.params.family) {
                Ecs.createFamily(system, systemData.params.family);
            }
        }

        if (typeof system.onAddToEngine === "function") {
            system.onAddToEngine(this as any);
        }

        Object.defineProperty(system, "engine", {
            value       : this,
            configurable: true,
        });

        Ecs.getFamilies(system).forEach((family) => {
            this.addFamilyInternally(family);
        });

    }

    protected removeSystemInternally(system: EcsSystem): void {
        this.logger.log("Removing [EcsSystem]", system.constructor.name);
        if (typeof system.onRemoveFromEngine === "function") {
            system.onRemoveFromEngine(this as any);
        }


        Object.defineProperty(system, "engine", {value: undefined});
        Ecs.getFamilies(system).forEach((family) => {
            this.removeFamilyInternally(family);
        });
    }
}

class EcsBasicEngine extends AbstractEcsEngine {
    public addEntity(entity: EcsEntity): void {
        console.assert(EcsMarker.isEntity(entity), "Only EcsEntity can be added to engine ")

        this.entities.addEntity(entity);
    }

    public removeEntity(entity: EcsEntity): void {
        this.entities.removeEntity(entity);
    }

    public addSystem(system: EcsSystem, index?: number): void {
        console.assert(EcsMarker.isSystem(system), "Only EcsSystem can be added to engine ");
        this.systems.addSystem(system as EcsSystem, index);
    }

    public removeSystem(system: Type<EcsSystem>): void {
        const systemInstance = this.systems.findSystemByInstance(system)!;
        this.systems.removeSystem(systemInstance);
    }

    public removeAllSystems(): void {
        throw new Error("Not implemented");
    }
}

export class EcsEngine extends EcsBasicEngine {
    private updating = false;
    private async    = false;

    public setAsync(value: boolean): void {
        this.async = value;
    }

    public update(delta: number, mode = EcsEngineMode.DEFAULT): void {
        this.run(this.systems.getSortedSystems(), mode, delta);
    }

    private async run(systems: readonly EcsSystem[], mode: EcsEngineMode, delta: number): Promise<void> {
        this.updating = true;
        await this[mode](systems, delta);
        this.updating = false;
    }

    private afterSystemUpdateFinish(): void {
        while (this.entities.hasPendingOperations()) {
            this.entities.processPendingOperations();
        }
    }

    private [EcsEngineMode.DEFAULT](systems: readonly EcsSystem[], delta: number): void {
        systems.forEach((system) => {
            if (!system.disabled) {
                this.runSystem(system, delta, EcsSystemMode.SYNC);
            }
            this.afterSystemUpdateFinish();
        });
    }

    private async [EcsEngineMode.SUCCESSIVE](systems: readonly EcsSystem[], delta: number): Promise<void> {
        for (const system of systems) {
            if (!system.disabled) {
                await this.runSystem(system, delta, EcsSystemMode.SYNC);
            }
            this.afterSystemUpdateFinish();
        }
    }

    private async [EcsEngineMode.PARALLEL](systems: readonly EcsSystem[], delta: number): Promise<void> {
        const promises = systems.filter((system) => !system.disabled).map((system) => async () => {
            await this.runSystem(system, delta, EcsSystemMode.ASYNC);
            this.afterSystemUpdateFinish();
        });
        await Promise.all(promises);
    }

    private async runSystem(system: EcsSystem, delta: number, mode = EcsSystemMode.SYNC): Promise<void> {
        if (mode === EcsSystemMode.SYNC) {
            try {
                system.updating = true;
                system?.update(delta);
            } catch (e) {
                system.onError && system.onError(e);
            } finally {
                system.updating = false;
            }
        } else {
            system.updating = true;
            try {
                await system?.update(delta);
            } catch (e) {
                system.onError && system.onError(e);
            } finally {
                system.updating = false;
            }
        }
    }
}
