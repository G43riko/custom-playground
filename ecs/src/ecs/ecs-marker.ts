import type { EcsEntity } from "./ecs-entity";
import type { EcsSystem } from "./ecs-system";

class EcsMarkerClass {
    public readonly componentSymbol = Symbol.for("ECS_COMPONENT_IDENTIFIER");
    public readonly engineSymbol    = Symbol.for("ECS_ENGINE_IDENTIFIER");
    public readonly systemSymbol    = Symbol.for("ECS_SYSTEM_IDENTIFIER");
    public readonly familySymbol    = Symbol.for("ECS_FAMILY_IDENTIFIER");
    public readonly entitySymbol    = "id";
    private componentCounter        = 1;
    private systemCounter           = 1;
    private familyCounter           = 1;
    private entityCounter           = 1;
    private engineCounter           = 1;

    public markEntity(entity: EcsEntity): void {
        Object.defineProperty(entity, this.entitySymbol, {value: this.entityCounter++});
    }

    public isEntity(entity: any): entity is EcsEntity {
        return this.entitySymbol in entity;
    }

    public markSystem(entity: any): void {
        Object.defineProperty(entity, this.systemSymbol, {value: this.systemCounter++});
    }

    public isSystem(system: any): system is EcsSystem {
        return this.systemSymbol in system;
    }

    public markSystemInstance(system: any): void {
        Object.defineProperty(system, this.systemSymbol, {value: this.systemCounter++});
    }

    public markFamilyInstance(family: any): void {
        Object.defineProperty(family, this.familySymbol, {value: this.familyCounter++});
    }

    public markComponentInstance(component: any): void {
        Object.defineProperty(component, this.componentSymbol, {value: this.componentCounter++});
    }

    public isComponent(component: any): boolean {
        return this.componentSymbol in component;
    }

    public markEngineInstance(engine: any): void {
        Object.defineProperty(engine, this.engineSymbol, {value: this.engineCounter++});
    }
}

export const EcsMarker = new EcsMarkerClass();
