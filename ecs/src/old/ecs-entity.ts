import { Type } from "gtools";
import { AbstractListMapHolder } from "../ecs/abstract-list-map-holder";
import { EcsComponent } from "./ecs-component";

export class EcsEntity2 {
    public readonly id          = "ECS_ENTITY_" + Math.random();
    private readonly components = new Map<string, any>();

    public add(...components: (any | Type<unknown>)[]): void {
        components.forEach(component => {
            if (component.constructor.name === "Function") {
                this.components.set(component.name, new component());
            } else {
                this.components.set(component.constructor.name, component);
            }
        });
    }

    public getComponent(type: Type): any {
        return this.components.get(type.name as string);
    }

    public removeComponent(type: Type): void {
        this.components.delete(type.name as string);
    }

    public hasComponent(type: Type): boolean {
        return this.components.has(type.name as string);
    }
}

export class EcsEntity {
    public readonly id          = "ECS_ENTITY_" + Math.random();
    private readonly components = new AbstractListMapHolder<EcsComponent>("type");

    public addComponent(component: EcsComponent): void {
        this.components.add(component);
    }

    public addComponentType(componentType: (new () => EcsComponent)): void {
        this.components.add(new componentType());
    }

    public addComponents(...components: EcsComponent[]): void {
        components.forEach(this.addComponent, this);
    }

    public getComponent(type: EcsComponent["type"]): EcsComponent | undefined {
        return this.components.get(type);
    }

    public removeComponent(type: EcsComponent["type"]): void {
        this.components.remove(type);
    }

    public hasComponent(type: EcsComponent["type"]): boolean {
        return this.components.has(type);
    }
}
