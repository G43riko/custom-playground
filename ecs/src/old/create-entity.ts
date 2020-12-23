import { EcsEntity2 } from "./ecs-entity";

export function CreateEntity(...components: any[]): EcsEntity2 {
    const result = new EcsEntity2();

    result.add(...components);

    return result;
}
