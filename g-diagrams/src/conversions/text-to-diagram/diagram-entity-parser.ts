import { DiagramAccessModifier } from "../../class/common/diagram-access-modifier";
import { DiagramEntityFactory } from "../../class/diagram-entity-factory";
import { DiagramEntity } from "../../class/entity/diagram-entity";
import { DiagramEntityType, ParseDiagramEntityType } from "../../class/entity/diagram-entity-type";
import { ClassDiagramParserOptions } from "./class-diagram-parser-options";
import { DiagramAbstractParser } from "./diagram-abstract-parser";

export class DiagramEntityParser extends DiagramAbstractParser {
    public constructor(options: Partial<ClassDiagramParserOptions> = {}) {
        super({
            defaultAccessModifier: options.defaultAccessModifier ?? DiagramAccessModifier.PUBLIC,
            entityDivider        : options.entityDivider ?? "--",
        } as ClassDiagramParserOptions);
    }

    public parseImplements(rawImplements: string, factory: DiagramEntityFactory<DiagramEntity>): void {
        const trimmedImplements = rawImplements?.trim();
        if (!trimmedImplements) {
            return;
        }

        const implementsTokens = trimmedImplements.split(",");

        implementsTokens.forEach((implementsToken) => {
            const trimmedImplementsToken = implementsToken.trim();
            if (!trimmedImplementsToken) {
                return;
            }

            if (!trimmedImplementsToken.match(/[<>]/)) {
                return factory.addParentImplements(trimmedImplementsToken);
            }

            throw new Error("Parsing of generic interfaces are not implemented");
        });
    }

    public parseExtends(rawExtends: string, factory: DiagramEntityFactory<DiagramEntity>): void {
        const trimmedExtends = rawExtends?.trim();
        if (trimmedExtends) {
            factory.setParentExtends(trimmedExtends);
        }
    }

    public parseEntityBasic(content: string): {
        type: DiagramEntityType,
        bodyRows: string[],
        rawExtends: string,
        rawImplements: string,
        modifiers: any,
        name: string,
    } {
        const bodyStartIndex = content.indexOf("{");
        const bodyEndIndex   = content.indexOf("}", bodyStartIndex + 1);
        const header         = content.substr(0, bodyStartIndex);
        const body           = content.substring(bodyStartIndex + 1, bodyEndIndex);

        const [tmpHeader, rawImplements] = header.split("implements");
        const [mainHeader, rawExtends]   = tmpHeader.split("extends");

        // TODO: process rest;

        const headerTokens = mainHeader.trim().split(" ");

        const name    = headerTokens[headerTokens.length - 1];
        const rawType = headerTokens[headerTokens.length - 2];

        const type = ParseDiagramEntityType(rawType);
        if (!type) {
            throw new Error(`Cannot parse type ${rawType}`);
        }
        const modifiers = this.parseModifiersFromToken(headerTokens, this.options);
        const bodyRows  = body.replace(/\/\*(.|\n)*?\*\\/g, "").split("\n").map((e) => e.trim()).filter((e) => !!e);

        return {type, name, modifiers, bodyRows, rawImplements, rawExtends};
    }
}
