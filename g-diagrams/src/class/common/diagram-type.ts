export enum DiagramTypeNames {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    VOID = "VOID",
    LINK = "LINK",
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
}

// tslint:disable-next-line:variable-name
export const DiagramType = {
    String: {name: DiagramTypeNames.STRING},
    Number: {name: DiagramTypeNames.NUMBER},
    Boolean: {name: DiagramTypeNames.BOOLEAN},
    Union: (...enumValues: string[]): DiagramType => {
        return {enumValues, name: DiagramTypeNames.UNION};
    },
    Void: {name: DiagramTypeNames.VOID},

    /**
     * Link to entity
     * @param targetName - entity name
     */
    Link: (targetName: string): DiagramType => {
        return {name: DiagramTypeNames.LINK, className: targetName};
    },
};
