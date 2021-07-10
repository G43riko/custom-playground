import { DiagramElementType } from "../common/diagram-element-type";
import { DiagramGeneric } from "../common/diagram-generic";
import { DiagramType } from "../common/diagram-type";

export interface DiagramPrimitive {
    readonly elementType: DiagramElementType.PRIMITIVE;
    readonly name: string;
    readonly value: DiagramType;
    readonly generics?: DiagramGeneric[];
}
