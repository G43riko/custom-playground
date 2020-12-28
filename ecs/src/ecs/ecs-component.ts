import { Type } from "gtools";
import { Ecs } from "./ecs-holder";

export interface EcsComponentParams {
    alias?: string;
    dependencies?: Type<any>[];
}

// TODO: move to ecs-decorators.ts
export function EcsComponent<T extends Type<any>>(params: EcsComponentParams = {}): (constructor: T) => any {
    return (constructor: T): T => {
        Ecs.registerComponentData({
            params,
            type: constructor,
        });

        return constructor;
    };
}
