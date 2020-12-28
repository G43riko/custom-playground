import { Type } from "gtools";
import { EcsEngine } from "./ecs-engine";
import { EcsEntity } from "./ecs-entity";
import { Ecs } from "./ecs-holder";
import { FamilyParams } from "./family-params";

export interface EcsSystem {
    readonly disabled?: boolean;
    readonly engine?: EcsEngine;

    updating?: boolean;

    onAddToEngine?(engine: EcsEngine): void;

    onRemoveFromEngine?(engine: EcsEngine): void;

    onEntityAdded?(entity: EcsEntity): void;

    onEntityRemoved?(entity: EcsEntity): void;

    update(delta: number): void;

    onError?(error: any): void;
}

export interface EcsSystemParams {
    family?: FamilyParams & {
        propertyName?: string;
    }
}
// TODO: move to ecs-decorators.ts
export function EcsSystem<T extends Type<any>>(params: EcsSystemParams = {}): (constructor: T) => any {
    return (constructor: T): T => {
        Ecs.registerSystemData({
            params,
            type: constructor,
        });

        return constructor;
    };
}
