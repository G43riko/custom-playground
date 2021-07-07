import { DiagramAccessModifier } from "../common/diagram-access-modifier";
import { DiagramElementType } from "../common/diagram-element-type";
import { DiagramType } from "../common/diagram-type";
import { DiagramProperty } from "../property/diagram-property";
import { DiagramEntityType } from "./diagram-entity-type";

export interface DiagramEntity {
    readonly elementType: DiagramElementType.ENTITY;
    readonly name: string;
    readonly access?: DiagramAccessModifier;
    readonly parentExtend?: DiagramType;
    readonly parentImplements?: DiagramType[];
    readonly type: DiagramEntityType;
    readonly properties: readonly DiagramProperty[];
}
