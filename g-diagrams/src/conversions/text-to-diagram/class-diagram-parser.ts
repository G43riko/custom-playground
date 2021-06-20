import {ClassDiagramParserOptions} from "./class-diagram-parser-options";
import {DiagramAccessModifier} from "../../class/common/diagram-access-modifier";
import {DiagramElementType} from "../../class/common/diagram-element-type";
import {DiagramType} from "../../class/common/diagram-type";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {DiagramClass} from "../../class/entity/diagram-class";
import {DiagramEntity} from "../../class/entity/diagram-entity";
import {DiagramMethodParameter} from "../../class/method/diagram-method-parameter";
import {DiagramProperty} from "../../class/property/diagram-property";

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
export class ClassDiagramParser {
    public static text1 = `
type PersonId = string
--
abstract class AbstractPerson {
    public readonly id: PersonId
    #name: string
    alive = true
    age: number = 0

    public toString(): string
    protected setName(name: string): void
    private setAge(name: number, force = true): void
}`;
    private readonly entityDivider = "--";

    public parse(content: string, options: Partial<ClassDiagramParserOptions>): any[] {
        const realOptions = Object.assign({
            defaultAccessModifier: DiagramAccessModifier.PUBLIC,
            entityDivider: "--",
        } as ClassDiagramParserOptions, options);
        const entities = content.split(realOptions.entityDivider);

        const result = entities.map((entityContent) => {
            const trimmedEntityContent = entityContent.trim();
            if (trimmedEntityContent.startsWith("type")) {
                return this.parsePrimitive(trimmedEntityContent, realOptions);
            }

            return this.parseEntity(trimmedEntityContent, realOptions);
        });

        return result;
    }

    private parsePrimitive(content: string, options: ClassDiagramParserOptions): { name: string, type: string } {
        const match = content.match(/type\W+([a-zA-Z0-6_-]+)\W+=\W([a-zA-Z0-6_-]+)/);

        if (!match) {
            return null;
        }

        return {
            name: match[1],
            type: match[2],
        };
    }

    private parseEntity(content: string, options: ClassDiagramParserOptions): DiagramEntity {
        const bodyStartIndex = content.indexOf("{");
        const bodyEndIndex = content.indexOf("}", bodyStartIndex + 1);
        const header = content.substr(0, bodyStartIndex);
        const body = content.substring(bodyStartIndex + 1, bodyEndIndex);

        const headerTokens = header.trim().split(" ");

        const name = headerTokens[headerTokens.length - 1];
        const type = headerTokens[headerTokens.length - 2];

        const factory = type === "class" ? DiagramEntityFactory.createClass(name) : null;

        const modifiers = this.parseModifiersFromToken(headerTokens, options);

        factory.setAbstract(modifiers.abstract);

        const bodyActiveRows = body.replace(/\/\*(.|\n)*?\*\\/g, "").split("\n").map((e) => e.trim()).filter((e) => !!e);

        bodyActiveRows.forEach((row) => {
            const isMethod = row.match(/\(.*\)/);

            if (isMethod) {
                return this.parseMethod(row, options, factory);
            }
            factory.addPropertyRaw(this.getParsedProperty(row, options));
        });

        return factory.build();
    }

    private getMethodAndReturnTypeFromMethod(content: string): { method: string, returnType: string } {
        const lastIndexOfTypeDivider = content.lastIndexOf(":");

        if (lastIndexOfTypeDivider < 0) {
            return {method: content, returnType: undefined};
        }

        return {
            method: content.substr(0, lastIndexOfTypeDivider),
            returnType: content.substring(lastIndexOfTypeDivider + 1).trim(),
        };
    }

    private parseMethod(content: string, options: ClassDiagramParserOptions, factory: DiagramEntityFactory<DiagramClass>): void {
        const params = content.match(/\((.|\n)*\)/);

        const {method, returnType} = this.getMethodAndReturnTypeFromMethod(content);

        const tokens = method.replace(/\((.|\n)*\)/g, "").trim().split(" ");

        const modifiers = this.parseModifiersFromToken(tokens, options);
        const rawName = tokens[tokens.length - 1];
        const name = rawName;

        factory.addMethodRaw({
            name,
            abstract: modifiers.abstract,
            final: modifiers.final,
            access: modifiers.accessor,
            static: modifiers.static,
            returnType: DiagramType.Link(returnType.trim()),
            parameters: params[0].match(/\(\W*\)/) ? undefined : this.getMethodParams(params[0].trim(), options),

        });
    }

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

    /**
     * TODO: Check arrays
     */
    private getParsedProperty(content: string, options: ClassDiagramParserOptions): DiagramProperty {
        const [data, defaultValue] = content.split("=");

        const [info, type] = data.split(":");

        const infoTokens = info.trim().split(" ");

        // TODO: check accessorPrefix
        const rawName = infoTokens[infoTokens.length - 1];
        const name = rawName;

        const modifiers = this.parseModifiersFromToken(infoTokens, options);

        return {
            name,
            defaultValue: defaultValue?.trim(),
            type: DiagramType.Link(type),
            final: modifiers.final,
            abstract: modifiers.abstract,
            static: modifiers.static,
            access: modifiers.accessor,
            optional: false,
            value: defaultValue,
            elementType: DiagramElementType.PROPERTY,
        };
    }

    private parseModifiersFromToken(tokens: string[], options: ClassDiagramParserOptions): {
        readonly accessor: DiagramAccessModifier;
        readonly static: boolean;
        readonly abstract: boolean;
        readonly final: boolean;
    } {
        const defaultModifiers = {
            accessor: options.defaultAccessModifier,
            static: false,
            abstract: false,
            final: false,
        };

        return tokens.reduce((acc, token) => {
            const trimmedToken = token.trim();

            switch (trimmedToken.toLowerCase()) {
                case "private":
                    return Object.assign(acc, {accessor: DiagramAccessModifier.PRIVATE});
                case "public":
                    return Object.assign(acc, {accessor: DiagramAccessModifier.PUBLIC});
                case "protected":
                    return Object.assign(acc, {accessor: DiagramAccessModifier.PROTECTED});
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
