import {DiagramGeneric, DiagramGenericToString} from "./diagram-generic";

export enum DiagramTypeNames {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    VOID = "VOID",
    LINK = "LINK",
    UNKNOWN = "UNKNOWN",
    UNION = "UNION",
}

export interface DiagramType {
    readonly name?: string | DiagramTypeNames;
    /**
     * Target link name
     */
    readonly className?: string;
    readonly array?: boolean;
    readonly enumValues?: string[];
    readonly generics?: DiagramGeneric[];
}


export const AdvancedDiagramType = {
    Observable: (type: DiagramType): DiagramType => ({
        name: "Observable",
        generics: [{
            name: DiagramTypeToString(type),
        }],
    }),
};

// TODO: add Observable
// tslint:disable-next-line:variable-name
export const DiagramType = {
    String: {name: DiagramTypeNames.STRING},
    StringArray: {name: DiagramTypeNames.STRING, array: true},
    Number: {name: DiagramTypeNames.NUMBER},
    Unknown: {name: DiagramTypeNames.UNKNOWN},
    NumberArray: {name: DiagramTypeNames.NUMBER, array: true},
    Boolean: {name: DiagramTypeNames.BOOLEAN},
    BooleanArray: {name: DiagramTypeNames.BOOLEAN, array: true},
    Union: (...enumValues: string[]): DiagramType => ({enumValues, name: DiagramTypeNames.UNION}),
    Void: {name: DiagramTypeNames.VOID},

    /**
     * Link to entity
     * @param targetName - entity name
     */
    Link: (targetName: string): DiagramType => ({name: DiagramTypeNames.LINK, className: targetName}),
    LinkGeneric: (targetName: string, ...generics: DiagramGeneric[]): DiagramType => ({
        generics,
        name: DiagramTypeNames.LINK,
        className: targetName,
    }),

    /**
     * Array of links to entity
     * @param targetName - entity name
     */
    LinkArray: (targetName: string): DiagramType => ({name: DiagramTypeNames.LINK, className: targetName, array: true}),
    // Observable: AdvancedDiagramType.Observable,
};

export function DiagramTypeToString(type: DiagramType): string {
    const generics = (): string => {
        if (!type.generics?.length) {
            return "";
        }

        return `<${type.generics.map(DiagramGenericToString).join(", ")}>`;
    };


    if (Array.isArray(type.enumValues)) {
        const joinedEnumValues = type.enumValues.join(" | ");

        if (joinedEnumValues.length === 1) {
            return type.array ? `${joinedEnumValues}[]` : joinedEnumValues;
        }

        return type.array ? `(${joinedEnumValues})[]` : joinedEnumValues;
    }

    const realName = type.name === DiagramTypeNames.LINK ? type.className : type.name;
    const typeName = realName + generics();

    if (typeName.match(/[< |]/)) {
        return type.array ? `(${typeName})[]` : typeName;
    }

    return type.array ? `${typeName}[]` : typeName;
}

