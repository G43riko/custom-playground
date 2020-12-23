import { EcsComponent } from "./ecs-component";
import { EcsEntity } from "./ecs-entity";


export class EcsFamily<T extends EcsComponent["type"] = EcsComponent["type"]> {
    public constructor(
        private readonly mustHave: readonly T[]  = [],
        private readonly oneOff: readonly T[]    = [],
        private readonly exclusive: readonly T[] = [],
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
