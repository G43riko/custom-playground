import { EcsEntity } from "./ecs-entity";
import { FamilyParams } from "./family-params";

export class EcsFamily<T = any> {
    public readonly id                    = "ECS_FAMILY_" + Date.now() + "_" + Math.random();
    private internalEntities: EcsEntity[] = [];

    public constructor(public readonly name: string, private readonly params: FamilyParams) {
    }

    public get entities(): readonly EcsEntity<T>[] {
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
        if (this.params.except?.some((component) => entity.hasComponent(component))) {
            return false;
        }

        if (!this.params.required?.every((component) => entity.hasComponent(component))) {
            return false;
        }

        if (!this.params.optional?.length) {
            return true;
        }

        if (!Array.isArray(this.params.optional[0])) {
            return this.params.optional.some((component: any) => entity.hasComponent(component));

        }

        return this.params.optional.every((optional: any) => {
            optional.some((component: any) => entity.hasComponent(component));
        });
    }

    public onEntityRemove(...entities: EcsEntity[]): void {
        this.internalEntities = this.internalEntities.filter((entity) => !entities.some((e) => e.id === entity.id));
    }

    public toString(): string {
        return `[EcsFamily] ${this.name} (${this.internalEntities.length})`;
    }
}
