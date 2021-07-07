import { DiagramGeneric } from "../common/diagram-generic";
import { DiagramMethod } from "../method/diagram-method";
import { DiagramEntity } from "./diagram-entity";
import { DiagramEntityType } from "./diagram-entity-type";

export interface DiagramClass extends DiagramEntity {
    readonly type: DiagramEntityType.CLASS;
    readonly generics?: DiagramGeneric[];
    readonly abstract?: boolean;
    readonly static?: boolean;
    readonly final?: boolean;
    readonly methods: readonly DiagramMethod[];
}
