import { Type } from "gtools";

export interface FamilyParams {
    readonly required?: readonly Type<any>[];
    readonly optional?: readonly (Type<any>[] | Type<any>)[];
    readonly except?: readonly Type<any>[];
    readonly minCount?: number;
    readonly maxCount?: number;
    readonly count?: number;
}
