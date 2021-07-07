import { DiagramType, DiagramTypeToString } from "./diagram-type";

export interface DiagramGeneric {
    readonly name: string;
    readonly extends?: DiagramType;
    readonly defaultValue?: DiagramType;
}

export function DiagramGenericToString(generic: DiagramGeneric): string {
    return [
        generic.name,
        generic.extends ? `extends ${DiagramTypeToString(generic.extends)}` : "",
        generic.defaultValue ? `= ${DiagramTypeToString(generic.defaultValue)}` : "",
    ].filter((e) => e).join(" ");
}
