import { DiagramType } from "../class/common/diagram-type";
import { DiagramLinkType } from "./diagram-link-type";

/**
 * Link between two elements
 */
export interface DiagramLink {
    readonly from: DiagramType;
    readonly to: DiagramType;
    type: DiagramLinkType
}

export const DiagramLink = {
    Composition(holder: string, property: string): DiagramLink {
        return {
            from: DiagramType.Link(property),
            to  : DiagramType.Link(holder),
            type: DiagramLinkType.COMPOSITION,
        };
    },
    Aggregation(holder: string, property: string): DiagramLink {
        return {
            from: DiagramType.Link(property),
            to  : DiagramType.Link(holder),
            type: DiagramLinkType.AGGREGATION,
        };
    },
    Generalization(parent: string, child: string): DiagramLink {
        return {
            from: DiagramType.Link(child),
            to  : DiagramType.Link(parent),
            type: DiagramLinkType.GENERALIZATION,
        };
    },
    Realization(parent: string, child: string): DiagramLink {
        return {
            from: DiagramType.Link(child),
            to  : DiagramType.Link(parent),
            type: DiagramLinkType.REALIZATION,
        };
    },
};
