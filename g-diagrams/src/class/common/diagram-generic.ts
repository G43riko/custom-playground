import { DiagramType, DiagramTypeToString } from "./diagram-type";

export interface DiagramGeneric {
    readonly name: string;
    readonly extends?: DiagramType;
    readonly defaultValue?: DiagramType;
}

export function DiagramGenericToString(generic: DiagramGeneric, nameMap?: { [name: string]: string }): string {
    return [
        generic.name,
        generic.extends ? `extends ${DiagramTypeToString(generic.extends, nameMap)}` : undefined,
        generic.defaultValue ? `= ${DiagramTypeToString(generic.defaultValue, nameMap)}` : undefined,
    ].filter((e) => e).join(" ");
}
