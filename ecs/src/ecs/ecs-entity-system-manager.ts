import { AbstractListMapHolder } from "./abstract-list-map-holder";
import { EcsEntitySystem } from "./ecs-entity-system";
import { EcsEntitySystemListener } from "./ecs-listeners";

export class EcsEntitySystemManager {
    private readonly systems = new AbstractListMapHolder<EcsEntitySystem>("type");

    public constructor(private readonly systemListeners: EcsEntitySystemListener) {
    }

    public addSystem(system: EcsEntitySystem): void {
        this.systems.add(system);
        this.systemListeners.systemAdded(system);
    }

    public removeSystem(system: EcsEntitySystem): void {
        this.systems.remove(system.type);
        this.systemListeners.systemRemoved(system);
    }

    public getSystems(): readonly EcsEntitySystem[] {
        return this.systems.values;
    }

    public removeAllSystems(): void {
        this.systems.clear();
    }

    public forEach(callback: (system: EcsEntitySystem, index: number) => void): void {
        this.systems.forEach(callback);
    }

    public getSystem(type: EcsEntitySystem["type"]): EcsEntitySystem {
        return this.systems.get(type);
    }
}
