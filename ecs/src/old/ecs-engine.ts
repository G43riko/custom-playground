import { AbstractListMapHolder } from "../ecs/abstract-list-map-holder";
import { EcsEngineMode } from "../ecs/ecs-engine-mode";
import { EcsEntityManager } from "../ecs/ecs-entity-manager";
import { EcsEntityListener, EcsEntitySystemListener } from "../ecs/ecs-listeners";
import { EcsSystemMode } from "../ecs/ecs-system-mode";
import { EcsEntity } from "./ecs-entity";
import { EcsEntitySystem } from "./ecs-entity-system";
import { EcsEntitySystemManager } from "./ecs-entity-system-manager";
import { EcsFamily } from "./ecs-family";
import { EcsStatefulFamily } from "./ecs-stateful-family";

export class EcsEngine {
    private readonly systemListener: EcsEntitySystemListener<EcsEntitySystem> = {
        systemAdded  : (system: EcsEntitySystem): void => {
            system.setEngine(this);
        },
        systemRemoved: (system: EcsEntitySystem): void => {
            system.setEngine(undefined);
        },
    };
    private updating                                                          = false;
    private async                                                             = false;
    private readonly families                                                 = new AbstractListMapHolder<EcsStatefulFamily>("id");
    private readonly systemManager                                            = new EcsEntitySystemManager(this.systemListener);
    private readonly entityListener: EcsEntityListener<EcsEntity>             = {
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
    private readonly entityManager                                            = new EcsEntityManager(this.entityListener);

    public setAsync(value: boolean): void {
        this.async = value;
    }

    public update(delta: number, mode = EcsEngineMode.DEFAULT): void {
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

    private run(systems: EcsEntitySystem[], mode: EcsEngineMode, delta: number): void {
        this[mode](systems, delta);
    }

    private afterSystemUpdateFinish(): void {
        while (this.entityManager.hasPendingOperations()) {
            this.entityManager.processPendingOperations();
        }
    }

    private [EcsEngineMode.DEFAULT](systems: EcsEntitySystem[], delta: number): void {
        systems.forEach((system) => {
            if (system.isProcessing()) {
                system.run(delta, EcsSystemMode.SYNC);
            }
            this.afterSystemUpdateFinish();
        });
    }

    private async [EcsEngineMode.SUCCESSIVE](systems: EcsEntitySystem[], delta: number): Promise<void> {
        for (const system of systems) {
            if (system.isProcessing()) {
                await system.run(delta, EcsSystemMode.SYNC);
            }
            this.afterSystemUpdateFinish();
        }
    }

    private async [EcsEngineMode.PARALLEL](systems: EcsEntitySystem[], delta: number): Promise<void> {
        const promises = systems.filter((system) => system.isProcessing()).map((system) => async () => {
            await system.run(delta, EcsSystemMode.ASYNC);
            this.afterSystemUpdateFinish();
        });
        await Promise.all(promises);
    }
}
