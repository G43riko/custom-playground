import { EcsEntity } from "./ecs-entity";
import { EcsEntitySystem } from "./ecs-entity-system";

export interface EcsEntityListener {
    entityAdded(entity: EcsEntity): void;

    entityRemoved(entity: EcsEntity): void;
}

export interface EcsEntitySystemListener {
    systemAdded(system: EcsEntitySystem): void;

    systemRemoved(system: EcsEntitySystem): void;
}
