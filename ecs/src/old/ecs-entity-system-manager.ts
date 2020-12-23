import { AbstractListMapHolder } from "../ecs/abstract-list-map-holder";
import { EcsEntitySystemListener } from "../ecs/ecs-listeners";

export class EcsEntitySystemManager<T extends { type: string }> {
    private readonly systems = new AbstractListMapHolder<T, "type">("type");

    public constructor(private readonly systemListeners: EcsEntitySystemListener<T>) {
    }

    public addSystem(system: T): void {
        this.systems.add(system);
        this.systemListeners.systemAdded(system);
    }

    public removeSystem(system: T): void {
        this.systems.remove(system.type);
        this.systemListeners.systemRemoved(system);
    }

    public getSystems(): readonly T[] {
        return this.systems.values;
    }

    public removeAllSystems(): void {
        this.systems.clear();
    }

    public forEach(callback: (system: T, index: number) => void): void {
        this.systems.forEach(callback);
    }

    public getSystem(type: T["type"]): T {
        return this.systems.get(type) as any;
    }
}
