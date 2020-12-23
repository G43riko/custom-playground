import { EcsEntity } from "./ecs-entity";
import { Ecs } from "./ecs-holder";
import { FamilyParams } from "./family-params";

export function Family(params: FamilyParams) {
    return (target: any, name: string): any => {
        Ecs.createFamily(target, params, name);
    };
}

export class EcsFamily<T = any> {
    public readonly id                    = "ECS_FAMILY_" + Date.now() + "_" + Math.random();
    private internalEntities: EcsEntity[] = [];

    public constructor(public readonly name: string, private readonly params: FamilyParams) {
    }

    public get entities(): readonly EcsEntity[] {
        return this.internalEntities;
    }

    public onEntityAdd(...entities: EcsEntity[]): void {
        this.internalEntities = [
            ...this.internalEntities,
            ...entities.filter((entity) => this.match(entity)),
        ];
    }


    public filter(...entities: readonly EcsEntity[]): readonly EcsEntity[] {
        return entities.filter((entity) => this.match(entity));
    }

    public match(entity: EcsEntity): boolean {
        if (this.params.exclusive?.some((component) => entity.hasComponent(component))) {
            return false;
        }

        if (!this.params.required?.every((component) => entity.hasComponent(component))) {
            return false;
        }

        return !this.params.optional?.length || this.params.optional.some((component) => entity.hasComponent(component));
    }

    public onEntityRemove(...entities: EcsEntity[]): void {
        this.internalEntities = this.internalEntities.filter((entity) => !entities.some((e) => e.id === entity.id));
    }

    public toString(): string {
        return `[EcsFamily] ${this.name} (${this.internalEntities.length})`;
    }
}
