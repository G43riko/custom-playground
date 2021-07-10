export enum DiagramAccessModifier {
    PUBLIC    = "PUBLIC",
    PROTECTED = "PROTECTED",
    PRIVATE   = "PRIVATE",
    PACKAGE   = "PACKAGE",
}

export function parseDiagramAccessModifier(param: string): DiagramAccessModifier | null {
    switch (param?.trim().toUpperCase()) {
        case DiagramAccessModifier.PUBLIC:
            return DiagramAccessModifier.PUBLIC;
        case DiagramAccessModifier.PROTECTED:
            return DiagramAccessModifier.PROTECTED;
        case DiagramAccessModifier.PRIVATE:
            return DiagramAccessModifier.PRIVATE;
        case DiagramAccessModifier.PACKAGE:
            return DiagramAccessModifier.PACKAGE;
        default:
            console.warn(`Cannot parse DiagramAccessModifier ${param}`);

            return null;
    }
}

export function DiagramAccessModifierToString(param: DiagramAccessModifier | null | undefined): string {
    switch (param) {
        case DiagramAccessModifier.PACKAGE:
            return "~";
        case DiagramAccessModifier.PRIVATE:
            return "-";
        case DiagramAccessModifier.PUBLIC:
            return "+";
        case DiagramAccessModifier.PROTECTED:
            return "/";
        default:
            console.warn(`Cannot parse DiagramAccessModifier ${param}`);

            return "";

    }
}
