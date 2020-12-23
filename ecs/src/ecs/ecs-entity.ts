import { Type } from "gtools";
import { Ecs } from "./ecs-holder";

export class EcsEntity<T extends Type = Type, S = any> {
    // @ts-ignore
    public readonly id: string;
    private readonly components = new Map<string, S>();

    public add<S extends new (...args: any[]) => T>(component: any | T, ...params: ConstructorParameters<S>): void {
        if (component.constructor.name === "Function") {
            this.components.set(component.name, Ecs.createComponent(component, ...params));
        } else {
            if (!Ecs.marker.isComponent(component)) {
                Ecs.registerComponentInstance(component);
            }
            this.components.set(component.constructor.name, component);
        }
    }

    public getComponent<U>(type: Type<U>): U {
        return this.components.get(type.name as string) as unknown as U;
    }

    public forEachComponent(callback: (component: S) => void): void {
        this.components.forEach((component) => callback(component));
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
