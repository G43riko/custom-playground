import { generateId } from "@g43/shared/models/id-generator";
import { EcsEntity } from "./ecs-entity";
import { EcsFamily } from "./ecs-family";

export class EcsStatefulFamily extends EcsFamily {
    public readonly id                    = generateId("StatefulFamily");
    private internalEntities: EcsEntity[] = [];

    public get entities(): readonly EcsEntity[] {
        return this.internalEntities;
    }

    public onEntityAdd(...entities: EcsEntity[]): void {
        this.internalEntities = [
            ...this.internalEntities,
            ...entities.filter((entity) => this.match(entity)),
        ];
    }

    public onEntityRemove(...entities: EcsEntity[]): void {
        this.internalEntities = this.internalEntities.filter((entity) => !entities.some((e) => e.id === entity.id));
    }
}
