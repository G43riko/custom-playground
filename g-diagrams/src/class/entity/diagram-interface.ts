import { DiagramGeneric } from "../common/diagram-generic";
import { DiagramMethod } from "../method/diagram-method";
import { DiagramEntity } from "./diagram-entity";
import { DiagramEntityType } from "./diagram-entity-type";

export interface DiagramInterface extends DiagramEntity {
    readonly type: DiagramEntityType.INTERFACE;
    readonly generics?: DiagramGeneric[];
    readonly methods: readonly DiagramMethod[];
}
