import { DiagramAccessModifier } from "../common/diagram-access-modifier";
import { DiagramElementType } from "../common/diagram-element-type";
import { DiagramGeneric } from "../common/diagram-generic";
import { DiagramType } from "../common/diagram-type";
import { DiagramMethodParameter } from "./diagram-method-parameter";

export interface DiagramMethod {
    readonly elementType: DiagramElementType.METHOD;
    readonly parameters?: readonly DiagramMethodParameter[];
    readonly returnType: DiagramType;
    readonly name: string;
    readonly static?: boolean;
    readonly generics?: DiagramGeneric[];
    readonly abstract?: boolean;
    readonly final?: boolean;
    readonly optional?: boolean;
    readonly access?: DiagramAccessModifier;
    readonly content?: string;
}
