import {DiagramLinkType} from "../../model/diagram-link-type";
import {DiagramEntityType} from "../../class/entity/diagram-entity-type";
import {DiagramAccessModifier} from "../../class/common/diagram-access-modifier";

export interface GojsNodeData {
    readonly key: number;
    readonly name: string;
    readonly entityType: DiagramEntityType
    readonly properties: {
        readonly name: string;
        readonly type: string;
        readonly visibility: DiagramAccessModifier;
    }[];
    readonly methods?: {
        readonly name: string;
        readonly entityType: string;
        readonly type: string;
        readonly visibility: DiagramAccessModifier;
        readonly parameters: {
            readonly name: string;
            readonly type: string
        }[]
    }[];
}

export interface GojsLinkData {
    from: number;
    to: number;
    relationship: DiagramLinkType;
}

export interface GojsData {
    readonly nodeData: GojsNodeData[];
    readonly linkData: GojsLinkData[]
}
