import { DiagramEntity } from "./class/entity/diagram-entity";
import { DiagramRelationshipType } from "./diagram-relationship-type";

export interface DiagramRelationship {
    readonly type: DiagramRelationshipType;
    readonly owner: DiagramEntity;
    readonly target: DiagramEntity;
}
