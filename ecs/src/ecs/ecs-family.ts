import { EcsComponent } from "./ecs-component";
import { EcsEntity } from "./ecs-entity";
import { EcsEntitySystem } from "./ecs-entity-system";

function Family() {
    return function(
        target: EcsEntitySystem,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        console.log();
    };
}

export class EcsFamily {
    public constructor(
        private readonly mustHave: readonly EcsComponent["type"][]  = [],
        private readonly oneOff: readonly EcsComponent["type"][]    = [],
        private readonly exclusive: readonly EcsComponent["type"][] = [],
    ) {
    }

    public filter(...entities: readonly EcsEntity[]): readonly EcsEntity[] {
        return entities.filter((entity) => this.match(entity));
    }

    protected match(entity: EcsEntity): boolean {
        if (this.exclusive.some((component) => entity.hasComponent(component))) {
            return false;
        }

        if (!this.mustHave.every((component) => entity.hasComponent(component))) {
            return false;
        }

        return !this.oneOff.length || this.oneOff.some((component) => entity.hasComponent(component));
    }
}
