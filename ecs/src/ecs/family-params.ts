import { Type } from "gtools";

export interface FamilyParams {
    readonly required?: readonly Type<any>[];
    readonly optional?: readonly Type<any>[];
    readonly exclusive?: readonly Type<any>[];
}
