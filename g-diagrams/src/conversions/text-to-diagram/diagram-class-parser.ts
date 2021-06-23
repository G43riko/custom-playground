import {DiagramEntityParser} from "./diagram-entity-parser";
import {ClassDiagramParserOptions} from "./class-diagram-parser-options";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {DiagramEntity} from "../../class/entity/diagram-entity";
import {DiagramType} from "../../class/common/diagram-type";
import {DiagramMethodParameter} from "../../class/method/diagram-method-parameter";
import {DiagramProperty} from "../../class/property/diagram-property";
import {DiagramElementType} from "../../class/common/diagram-element-type";

export class DiagramClassParser extends DiagramEntityParser {
    public parseClassBody(bodyActiveRows: string[], factory: DiagramEntityFactory<DiagramEntity>): void {
        bodyActiveRows.forEach((row) => {
            const isMethod = row.match(/\(.*\)/);

            if (isMethod) {
                return this.parseMethod(row, this.options, factory);
            }
            factory.addPropertyRaw(this.getParsedProperty(row, this.options));
        });
    }

    private getMethodAndReturnTypeFromMethod(content: string): { method: string, returnType?: string } {
        const lastIndexOfTypeDivider = content.lastIndexOf(":");

        if (lastIndexOfTypeDivider < 0) {
            return {method: content, returnType: undefined};
        }

        return {
            method: content.substr(0, lastIndexOfTypeDivider),
            returnType: content.substring(lastIndexOfTypeDivider + 1).trim(),
        };
    }

    private parseMethod(content: string, options: ClassDiagramParserOptions, factory: DiagramEntityFactory<DiagramEntity>): void {
        const params = content.match(/\((.|\n)*\)/);

        const {method, returnType} = this.getMethodAndReturnTypeFromMethod(content);

        const tokens = method.replace(/\((.|\n)*\)/g, "").trim().split(" ");

        const modifiers = this.parseModifiersFromToken(tokens, options);
        const rawName = tokens[tokens.length - 1];
        const name = rawName;

        const trimmedReturnType = returnType?.trim();

        factory.addMethodRaw({
            name,
            abstract: modifiers.abstract,
            final: modifiers.final,
            access: modifiers.accessor,
            static: modifiers.static,
            returnType: trimmedReturnType ? DiagramType.Link(trimmedReturnType) : DiagramType.Unknown,
            parameters: params ? params[0].match(/\(\W*\)/) ? undefined : this.getMethodParams(params[0].trim(), options) : undefined,

        });
    }

    /**
     * @param params - `^(.*)$`
     * @param options - options to parse params
     * @private
     */
    private getMethodParams(params: string, options: ClassDiagramParserOptions): DiagramMethodParameter[] {
        const cleanedParams = params.substring(1, params.length - 1);

        return cleanedParams.split(",").map((param, index) => {
            const trimmedParams = param.trim();
            const propertyData = this.getParsedProperty(trimmedParams, options);

            return {
                index,
                name: propertyData.name,
                type: propertyData.type,
                defaultValue: propertyData.defaultValue,
                optional: propertyData.optional,
            };
        });
    }

    private getTypeFromRawType(rawType: string): DiagramType {
        const trimmedType = rawType?.trim().replace(/[;]/g, "");
        if (!trimmedType) {
            return DiagramType.Unknown;
        }
        const isArray = trimmedType?.endsWith("[]");

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


    /**
     * TODO: Check arrays
     */
    private getParsedProperty(content: string, options: ClassDiagramParserOptions): DiagramProperty {
        const [data, defaultValue] = content.split("=");
        const [info, rawType] = data.split(":");
        const type = this.getTypeFromRawType(rawType);

        const infoTokens = info.trim().split(" ");

        // TODO: check accessorPrefix
        const rawName = infoTokens[infoTokens.length - 1];
        const name = rawName;

        const modifiers = this.parseModifiersFromToken(infoTokens, options);

        return {
            name,
            defaultValue: defaultValue?.trim(),
            type,
            final: modifiers.final,
            abstract: modifiers.abstract,
            static: modifiers.static,
            access: modifiers.accessor,
            optional: false,
            value: defaultValue,
            elementType: DiagramElementType.PROPERTY,
        };
    }
}
