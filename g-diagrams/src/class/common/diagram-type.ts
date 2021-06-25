import {DiagramGeneric, DiagramGenericToString} from "./diagram-generic";

export enum DiagramTypeName {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    VOID = "VOID",
    LINK = "LINK",
    UNKNOWN = "UNKNOWN",
    UNION = "UNION",
}

export interface DiagramType {
    readonly name?: string | DiagramTypeName;
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
    String: {name: DiagramTypeName.STRING},
    StringArray: {name: DiagramTypeName.STRING, array: true},
    Number: {name: DiagramTypeName.NUMBER},
    Unknown: {name: DiagramTypeName.UNKNOWN},
    UnknownArray: {name: DiagramTypeName.UNKNOWN, array: true},
    NumberArray: {name: DiagramTypeName.NUMBER, array: true},
    Boolean: {name: DiagramTypeName.BOOLEAN},
    BooleanArray: {name: DiagramTypeName.BOOLEAN, array: true},
    Union: (...enumValues: string[]): DiagramType => ({enumValues, name: DiagramTypeName.UNION}),
    Void: {name: DiagramTypeName.VOID},

    /**
     * Link to entity
     * @param targetName - entity name
     */
    Link: (targetName: string): DiagramType => ({name: DiagramTypeName.LINK, className: targetName}),
    LinkGeneric: (targetName: string, ...generics: DiagramGeneric[]): DiagramType => ({
        generics,
        name: DiagramTypeName.LINK,
        className: targetName,
    }),

    /**
     * Array of links to entity
     * @param targetName - entity name
     */
    LinkArray: (targetName: string): DiagramType => ({name: DiagramTypeName.LINK, className: targetName, array: true}),
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

    const realName = type.name === DiagramTypeName.LINK ? type.className : type.name;
    const typeName = realName + generics();

    if (typeName.match(/[< |]/)) {
        return type.array ? `(${typeName})[]` : typeName;
    }

    return type.array ? `${typeName}[]` : typeName;
}

export function ParseDiagramType(rawType: string): DiagramType {
    const trimmedType = rawType?.trim().replace(/[;]/g, "");
    if (!trimmedType) {
        return DiagramType.Unknown;
    }
    const isArray = trimmedType?.endsWith("[]");

    if (trimmedType.match(/void([ \t])*($|\n)/i)) {
        return DiagramType.Void;
    }
    if (trimmedType.match(/unknown(\[]| |\t)*($|\n)/i)) {
        return isArray ? DiagramType.UnknownArray : DiagramType.Unknown;
    }
    if (trimmedType.match(/string(\[]| |\t)*($|\n)/i)) {
        return isArray ? DiagramType.StringArray : DiagramType.String;
    }
    if (trimmedType.match(/number(\[]| |\t)*($|\n)/i)) {
        return isArray ? DiagramType.NumberArray : DiagramType.Number;
    }
    if (trimmedType.match(/boolean(\[]| |\t)*($|\n)/i)) {
        return isArray ? DiagramType.Boolean : DiagramType.Boolean;
    }

    return isArray ? DiagramType.LinkArray(trimmedType.replace("[]", "")) : DiagramType.Link(trimmedType);
}
