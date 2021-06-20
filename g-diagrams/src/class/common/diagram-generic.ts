import {DiagramType} from "./diagram-type";

export interface DiagramGeneric {
    readonly name: string;
    readonly extends?: DiagramType;
    readonly defaultValue?: DiagramType;
}
