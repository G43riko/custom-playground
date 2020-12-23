import { Type } from "gtools";
import { AbstractListMapHolder } from "./abstract-list-map-holder";
import { EcsEntitySystemListener } from "./ecs-listeners";

export class EcsSystemManager<T extends { name?: string }> {
    private readonly systems = new AbstractListMapHolder<T, "name">("name");

    private readonly sortedSystems: { system: T, index: number }[] = [];
    private sortedSystemsArray: T[]                                = [];

    public constructor(private readonly systemListeners: EcsEntitySystemListener<T>) {
    }

    public get length(): number {
        return this.systems.length;
    }

    public addSystem(system: T, index: number = this.sortedSystems.length): void {
        this.systems.add(system);
        this.systemListeners.systemAdded(system);

        this.sortedSystems.push({system, index: (isNaN(index) ? this.sortedSystems.length : index)});
        this.sortedSystems.sort((a, b) => a.index - b.index);

        this.sortedSystemsArray = this.sortedSystems.map((e) => e.system);
    }

    public getSortedSystems(): readonly T[] {
        return this.sortedSystemsArray;
    }

    public removeSystem(system: T): void {
        this.systems.remove(system.name!);
        this.systemListeners.systemRemoved(system);
        const index = this.sortedSystems.findIndex((s) => s.system.name == system.name);
        this.sortedSystems.splice(index, 1);
        this.sortedSystemsArray.splice(index, 1);
    }

    public removeAllSystems(): void {
        this.systems.clear();
    }

    public forEach(callback: (system: T, index: number) => void): void {
        this.systems.forEach(callback);
    }

    public getSystem(name: T["name"]): T {
        return this.systems.get(name!) as any;
    }

    public findSystemByInstance<U extends T>(system: Type<U>): U | undefined {
        return this.systems.values.find((e) => e instanceof system) as U;
    }
}
