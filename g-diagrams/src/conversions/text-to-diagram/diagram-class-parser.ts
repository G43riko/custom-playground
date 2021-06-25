import {DiagramEntityParser} from "./diagram-entity-parser";
import {ClassDiagramParserOptions} from "./class-diagram-parser-options";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {DiagramEntity} from "../../class/entity/diagram-entity";
import {DiagramType, ParseDiagramType} from "../../class/common/diagram-type";
import {DiagramMethodParameter} from "../../class/method/diagram-method-parameter";
import {DiagramMethod} from "../../class/method/diagram-method";
import {DiagramProperty} from "../../class/property/diagram-property";
import {DiagramElementType} from "../../class/common/diagram-element-type";

export class DiagramClassParser extends DiagramEntityParser {
    public parseClassBody(bodyActiveRows: string[], factory: DiagramEntityFactory<DiagramEntity>): void {
        bodyActiveRows.forEach((row) => {
            const isMethod = row.match(/\(.*\)/);

            if (isMethod) {
                return factory.addMethodRaw(this.parseMethod(row));
            }
            factory.addPropertyRaw(this.parseProperty(row));
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

    public parseMethod(content: string): DiagramMethod {
        const params = content.match(/\((.|\n)*\)/);

        const {method, returnType} = this.getMethodAndReturnTypeFromMethod(content);

        const tokens = method.replace(/\((.|\n)*\)/g, "").trim().split(" ");

        const modifiers = this.parseModifiersFromToken(tokens, this.options);
        const rawName = tokens[tokens.length - 1];
        const name = rawName;

        const trimmedReturnType = returnType?.trim();

        return {
            name,
            abstract: modifiers.abstract,
            final: modifiers.final,
            elementType: DiagramElementType.METHOD,
            access: modifiers.accessor,
            static: modifiers.static,
            returnType: trimmedReturnType ? ParseDiagramType(trimmedReturnType) : DiagramType.Unknown,
            parameters: params ? params[0].match(/\(\W*\)/) ? undefined : this.getMethodParams(params[0].trim(), this.options) : undefined,
        };
    }

    /**
     * TODO: determine type from default value
     */
    public parseProperty(content: string): DiagramProperty {
        const [data, defaultValue] = content.split("=");
        const [info, rawType] = data.split(":");
        const type = ParseDiagramType(rawType);

        const infoTokens = info.trim().split(" ");

        let optional = false;
        // check 'name ?: string' or 'age ? :number'
        if (infoTokens[infoTokens.length - 1].endsWith("?")) {
            const lastToken = infoTokens[infoTokens.length - 1];
            if (lastToken === "?") {
                infoTokens.pop();
            } else {
                infoTokens[infoTokens.length - 1] = lastToken.substring(0, lastToken.length - 1);
            }
            optional = true;
        }

        // TODO: check accessorPrefix
        const rawName = infoTokens[infoTokens.length - 1].replace(/[;]/g, "");
        const name = rawName;

        const modifiers = this.parseModifiersFromToken(infoTokens, this.options);
        const trimmedDefaultValue = defaultValue?.trim();

        return {
            name,
            optional,
            type,
            defaultValue: trimmedDefaultValue,
            final: modifiers.final,
            abstract: modifiers.abstract,
            static: modifiers.static,
            access: modifiers.accessor,
            value: trimmedDefaultValue,
            elementType: DiagramElementType.PROPERTY,
        };
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
            const propertyData = this.parseProperty(trimmedParams);

            return {
                index,
                name: propertyData.name,
                type: propertyData.type,
                defaultValue: propertyData.defaultValue,
                optional: propertyData.optional || propertyData.defaultValue !== undefined,
            };
        });
    }
}
