import { EcsEntitySystem, EcsSystem } from "../../src/ecs/ecs-entity-system";

@EcsSystem()
export class MoveSystem extends EcsEntitySystem {
    public static readonly type = "MOVE_SYSTEM";
    public readonly type        = "MOVE_SYSTEM";

    public update(delta: number): void {
        return undefined;
    }
}
