import { AbstractListMapHolder } from "./abstract-list-map-holder";
import { EcsComponent } from "./ecs-component";

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
