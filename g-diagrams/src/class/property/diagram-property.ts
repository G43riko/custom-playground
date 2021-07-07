import { DiagramAccessModifier } from "../common/diagram-access-modifier";
import { DiagramElementType } from "../common/diagram-element-type";
import { DiagramType } from "../common/diagram-type";

export interface DiagramProperty<T = any> {
    readonly elementType: DiagramElementType.PROPERTY;
    readonly access?: DiagramAccessModifier;
    readonly name: string;
    readonly type: DiagramType;
    readonly defaultValue?: T;
    readonly value?: T;
    readonly optional?: boolean;
    readonly static?: boolean;
    readonly final?: boolean;
    readonly abstract?: boolean;
}
