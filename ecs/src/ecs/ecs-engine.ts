import { AbstractListMapHolder } from "./abstract-list-map-holder";
import { EcsEntity } from "./ecs-entity";
import { EcsEntityManager } from "./ecs-entity-manager";
import { EcsEntitySystem, EcsEntitySystemMode } from "./ecs-entity-system";
import { EcsEntitySystemManager } from "./ecs-entity-system-manager";
import { EcsFamily } from "./ecs-family";
import { EcsEntityListener, EcsEntitySystemListener } from "./ecs-listeners";
import { EcsStatefulFamily } from "./ecs-stateful-family";

export enum EngineMode {
    SUCCESSIVE = "SUCCESSIVE",
    PARALLEL   = "PARALLEL",
    DEFAULT    = "DEFAULT",
}

export class EcsEngine {
    private readonly systemListener: EcsEntitySystemListener = {
        systemAdded  : (system: EcsEntitySystem): void => {
            system.setEngine(this);
        },
        systemRemoved: (system: EcsEntitySystem): void => {
            system.setEngine(undefined);
        },
    };
    private updating                                         = false;
    private async                                            = false;
    private readonly families                                = new AbstractListMapHolder<EcsStatefulFamily>("id");
    private readonly entityManager                           = new EcsEntityManager(this.entityListener);
    private readonly systemManager                           = new EcsEntitySystemManager(this.systemListener);
    private readonly entityListener: EcsEntityListener       = {
        entityAdded  : (entity: EcsEntity): void => {
            this.families.forEach((family) => {
                family.onEntityAdd(entity);
            });
            this.systemManager.forEach((system) => system.entityAdded(entity));
        },
        entityRemoved: (entity: EcsEntity): void => {
            this.families.forEach((family) => family.onEntityRemove(entity));
            this.systemManager.forEach((system) => system.entityRemoved(entity));
        },
    };

    public setAsync(value: boolean): void {
        this.async = value;
    }

    public update(delta: number, mode = EngineMode.DEFAULT): void {
        this.updating = true;
        this.systemManager.getSystems().forEach((system) => {
            if (system.isProcessing()) {
                system.update(delta);
            }

            while (this.entityManager.hasPendingOperations()) {
                this.entityManager.processPendingOperations();
            }
        });
        this.updating = false;
    }

    public addSystem(system: EcsEntitySystem): void {
        this.systemManager.addSystem(system);
    }

    public getSystem(systemId: string): void {
        this.systemManager.getSystem(systemId);
    }

    public removeSystem(system: EcsEntitySystem): void {
        this.systemManager.removeSystem(system);
    }

    public addEntity(entity: EcsEntity): void {
        this.entityManager.addEntity(entity, this.updating);
    }

    public removeEntity(entity: EcsEntity): void {
        this.entityManager.removeEntity(entity, this.updating);
    }

    public removeAllSystems(): void {
        this.systemManager.removeAllSystems();
    }

    public getFamilyMembers(family: EcsFamily): readonly EcsEntity[] {
        return family.filter(...this.entityManager.getEntities());
    }

    public addFamily(family: EcsStatefulFamily): void {
        family.onEntityAdd(...this.entityManager.getEntities());
        this.families.add(family);
    }

    public removeFamily(family: EcsStatefulFamily): void {
        this.families.remove(family.id);
    }

    private run(systems: EcsEntitySystem[], mode: EngineMode, delta: number): void {
        this[mode](systems, delta);
    }

    private afterSystemUpdateFinish(): void {
        while (this.entityManager.hasPendingOperations()) {
            this.entityManager.processPendingOperations();
        }
    }

    private [EngineMode.DEFAULT](systems: EcsEntitySystem[], delta: number): void {
        systems.forEach((system) => {
            if (system.isProcessing()) {
                system.run(delta, EcsEntitySystemMode.SYNC);
            }
            this.afterSystemUpdateFinish();
        });
    }

    private async [EngineMode.SUCCESSIVE](systems: EcsEntitySystem[], delta: number): Promise<void> {
        for (const system of systems) {
            if (system.isProcessing()) {
                await system.run(delta, EcsEntitySystemMode.SYNC);
            }
            this.afterSystemUpdateFinish();
        }
    }

    private async [EngineMode.PARALLEL](systems: EcsEntitySystem[], delta: number): Promise<void> {
        const promises = systems.filter((system) => system.isProcessing()).map((system) => async () => {
            await system.run(delta, EcsEntitySystemMode.ASYNC);
            this.afterSystemUpdateFinish();
        });
        await Promise.all(promises);
    }
}
