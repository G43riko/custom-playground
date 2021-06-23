/**
 * TODO: add PRIMITIVE, PACKAGE
 */
export enum DiagramEntityType {
    CLASS = "CLASS",
    INTERFACE = "INTERFACE",
    ENUM = "ENUM",
}


export function ParseDiagramEntityType(data: string | null): DiagramEntityType | null {
    switch (data?.trim().toLowerCase()) {
        case "class":
            return DiagramEntityType.CLASS;
        case "enum":
            return DiagramEntityType.ENUM;
        case "interface":
            return DiagramEntityType.INTERFACE;
        default:
            return null;
    }
}
