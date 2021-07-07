import { DiagramAccessModifier } from "../../class/common/diagram-access-modifier";
import { ClassDiagramParserOptions } from "./class-diagram-parser-options";

/**
 * type PersonId = string
 * -
 * abstract class AbstractPerson {
 *     public readonly id: PersonId
 *     #name: string
 *     alive = true
 *     age: number = 0
 *
 *     public setName(name: string): void
 * }
 */
export abstract class DiagramAbstractParser {
    protected constructor(protected readonly options: ClassDiagramParserOptions) {
    }

    protected parseModifiersFromToken(tokens: string[], options: ClassDiagramParserOptions): {
        readonly accessor: DiagramAccessModifier;
        readonly static: boolean;
        readonly abstract: boolean;
        readonly final: boolean;
    } {
        const defaultModifiers = {
            accessor: options.defaultAccessModifier,
            static  : false,
            abstract: false,
            final   : false,
        };

        let haveAccessModifier = false;

        return tokens.reduce((acc, token) => {
            const trimmedToken = token.trim();

            switch (trimmedToken.toLowerCase()) {
                case "private":
                    if (haveAccessModifier) {
                        throw new Error("Cannot apply multiple access modifiers");
                    }
                    haveAccessModifier = true;

                    return Object.assign(acc, {accessor: DiagramAccessModifier.PRIVATE});
                case "public":
                    if (haveAccessModifier) {
                        throw new Error("Cannot apply multiple access modifiers");
                    }
                    haveAccessModifier = true;

                    return Object.assign(acc, {accessor: DiagramAccessModifier.PUBLIC});
                case "protected":
                    if (haveAccessModifier) {
                        throw new Error("Cannot apply multiple access modifiers");
                    }
                    haveAccessModifier = true;

                    return Object.assign(acc, {accessor: DiagramAccessModifier.PROTECTED});
                case "package":
                    if (haveAccessModifier) {
                        throw new Error("Cannot apply multiple access modifiers");
                    }
                    haveAccessModifier = true;

                    return Object.assign(acc, {accessor: DiagramAccessModifier.PACKAGE});
                case "static":
                    return Object.assign(acc, {static: true});
                case "abstract":
                    return Object.assign(acc, {abstract: true});
                case "readonly":
                case "final":
                    return Object.assign(acc, {final: true});
                default:
                    return acc;
            }
        }, defaultModifiers);
    }
}
