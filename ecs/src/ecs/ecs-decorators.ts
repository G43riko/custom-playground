import { Type } from "gtools";
import { Ecs } from "./ecs-holder";
import { FamilyParams } from "./family-params";

export function EcsBindFamily(params: FamilyParams) {
    return (target: any, name: string): any => {
        Ecs.createFamily(target, params, name);
    };
}

export function EcsBindSystem(system: Type<any>) {
    return (target: any, name: string): any => {
        Ecs.registerSystemBind(target, system, name);
    };
}
