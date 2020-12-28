import { Type } from "gtools";
import { EcsMarker } from "./ecs-marker";

export class EcsEntity<S = any> {
    // @ts-ignore
    public readonly id: string;
    private readonly components = new Map<string, unknown>();

    public add(component: any): void {
        console.assert(EcsMarker.isComponent(component), "Component " + component + " must be created via Ecs.createComponent");

        if ("entity" in component) {
            throw new Error("Property entity is already taken");
        }

        Object.defineProperty(component, "entity", {value: this});

        this.components.set(component.constructor.name, component);
    }

    public getComponent<U extends S = S>(type: Type<U>): U {
        return this.components.get(type.name as string) as unknown as U;
    }

    public forEachComponent(callback: (component: S) => void): void {
        this.components.forEach((component) => callback(component as S));
    }

    public removeComponent(type: Type<unknown>): void {
        this.components.delete(type.name as string);
    }

    public hasComponent(type: Type<unknown>): boolean {
        return this.components.has(type.name as string);
    }

    public toString(): string {
        return `[${this.constructor.name}] [${Array.from(this.components.values())
                                                   .map((c) => (c as any).constructor.name)
                                                   .join(", ")}]`;
    }
}
