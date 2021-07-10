import { DiagramElementType } from "../../class/common/diagram-element-type";
import { DiagramType } from "../../class/common/diagram-type";
import { DiagramPrimitive } from "../../class/entity/diagram-primitive";
import { ClassDiagramParserOptions } from "./class-diagram-parser-options";

export class DiagramPrimitiveParser {
    public constructor(
        private readonly parserOptions: ClassDiagramParserOptions,
    ) {
    }

    /**
     * TODO: add support for multiline types
     * @param content
     */
    public parseType(content: string): DiagramPrimitive | null {
        const match = content.match(/type\W+([a-zA-Z0-6_-]+)\W+=\W([a-zA-Z0-6_-]+)/);

        if (!match) {
            console.warn(`Cannot parse type from '${content}'`);

            return null;
        }

        return {
            elementType: DiagramElementType.PRIMITIVE,
            name       : match[1],
            value      : DiagramType.Link(match[2]),
        };
    }
}
