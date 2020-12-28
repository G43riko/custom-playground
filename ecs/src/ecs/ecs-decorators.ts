import { Ecs } from "./ecs-holder";
import { FamilyParams } from "./family-params";

export function Family(params: FamilyParams) {
    return (target: any, name: string): any => {
        Ecs.createFamily(target, params, name);
    };
}
