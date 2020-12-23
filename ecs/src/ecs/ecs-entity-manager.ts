import { AbstractListMapHolder } from "./abstract-list-map-holder";
import { EcsEntityListener } from "./ecs-listeners";

export class EcsEntityManager<T extends { id: string }> {
    private readonly entities                          = new AbstractListMapHolder<T, "id">("id");
    private readonly pendingOperations: (() => void)[] = [];

    public constructor(private readonly listener: EcsEntityListener<T>) {

    }

    public get length(): number {
        return this.entities.length;
    }

    public removeAllEntities(): void {
        this.entities.clear();
    }

    public hasPendingOperations(): boolean {
        return this.pendingOperations.length > 0;
    }

    public processPendingOperations(): void {
        this.pendingOperations.forEach((operation) => operation());
        this.pendingOperations.splice(0, this.pendingOperations.length);
    }

    public addEntity(entity: T, delayed = false): void {
        if (delayed) {
            this.pendingOperations.push(() => this.addEntityInternally(entity));
        } else {
            this.addEntityInternally(entity);
        }
    }

    public removeEntityInternally(entity: T): void {
        this.entities.remove(entity.id);
        this.listener.entityRemoved(entity);
    }

    public removeEntity(entity: T, delayed = false): void {
        if (delayed) {
            this.pendingOperations.push(() => this.removeEntityInternally(entity));
        } else {
            this.removeEntityInternally(entity);
        }
    }

    public getEntities(): readonly T[] {
        return this.entities.values;
    }

    private addEntityInternally(entity: T): void {
        this.entities.add(entity);
        this.listener.entityAdded(entity);
    }

}
