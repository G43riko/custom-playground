import { AbstractListMapHolder } from "./abstract-list-map-holder";
import { EcsEntity } from "./ecs-entity";
import { EcsEntityListener } from "./ecs-listeners";

export class EcsEntityManager {
    private readonly entities                          = new AbstractListMapHolder<EcsEntity>("id");
    private readonly pendingOperations: (() => void)[] = [];

    public constructor(private readonly listener: EcsEntityListener) {

    }

    public hasPendingOperations(): boolean {
        return this.pendingOperations.length > 0;
    }

    public processPendingOperations(): void {
        this.pendingOperations.forEach((operation) => operation());
        this.pendingOperations.splice(0, this.pendingOperations.length);
    }

    public addEntity(entity: EcsEntity, delayed = false): void {
        if (delayed) {
            this.pendingOperations.push(() => this.addEntityInternally(entity));
        } else {
            this.addEntityInternally(entity);
        }
    }

    public removeEntityInternally(entity: EcsEntity): void {
        this.entities.remove(entity.id);
        this.listener.entityRemoved(entity);
    }

    public removeEntity(entity: EcsEntity, delayed = false): void {
        if (delayed) {
            this.pendingOperations.push(() => this.removeEntityInternally(entity));
        } else {
            this.removeEntityInternally(entity);
        }
    }

    public getEntities(): readonly EcsEntity[] {
        return this.entities.values;
    }

    private addEntityInternally(entity: EcsEntity): void {
        this.entities.add(entity);
        this.listener.entityAdded(entity);
    }

}
