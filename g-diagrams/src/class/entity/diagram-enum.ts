import {DiagramEntity} from "./diagram-entity";
import {DiagramEntityType} from "./diagram-entity-type";

export interface DiagramEnum extends DiagramEntity {
    readonly type: DiagramEntityType.ENUM;
}
