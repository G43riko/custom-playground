import { DiagramAccessModifier } from "../../class/common/diagram-access-modifier";
import { DiagramElementType } from "../../class/common/diagram-element-type";
import { DiagramEntityFactory } from "../../class/diagram-entity-factory";
import { DiagramEntity } from "../../class/entity/diagram-entity";
import { DiagramEntityType } from "../../class/entity/diagram-entity-type";
import { DiagramCheckers } from "../../diagram-checkers";
import { DiagramLink } from "../../model/diagram-link";
import { DiagramModel } from "../../model/diagram-model";
import { ClassDiagramParserOptions } from "./class-diagram-parser-options";
import { DiagramAbstractParser } from "./diagram-abstract-parser";
import { DiagramClassParser } from "./diagram-class-parser";
import { DiagramEnumParser } from "./diagram-enum-parser";

/**
 * Is used to parse diagram and create DiagramModel
 * TODO:
 *   - should be renamed to TypescriptDiagramParser
 *   - Primitive parser should be added to parser `type PersonId = string`
 *
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
export class DiagramParser extends DiagramAbstractParser {
    private readonly classParser = new DiagramClassParser(this.options);
    private readonly enumParser  = new DiagramEnumParser(this.options);

    public constructor(options: Partial<ClassDiagramParserOptions> = {}) {
        super(Object.assign({
            defaultAccessModifier: DiagramAccessModifier.PUBLIC,
            entityDivider        : "--",
        }, options) as ClassDiagramParserOptions);
    }

    public parse(content: string): any[] {
        const entities = content.split(this.options.entityDivider);

        const result = entities.map((entityContent) => {
            const trimmedEntityContent = entityContent.trim();
            if (trimmedEntityContent.startsWith("type")) {
                return this.parsePrimitive(trimmedEntityContent, this.options);
            }

            return this.parseEntity(trimmedEntityContent);
        });

        return result;
    }

    public parseToDiagram(content: string): DiagramModel {
        const parseResult                      = this.parse(content);
        const result                           = new DiagramModel();
        const createdEntities: DiagramEntity[] = [];

        parseResult.forEach((item) => {
            if (item.elementType === DiagramElementType.PRIMITIVE) {
                return result.defineType({name: item.name, className: item.type});
            }

            if (DiagramCheckers.isEntity(item)) {
                const createdEntity = result.addEntity(item);

                return createdEntities.push(createdEntity);
            }
            console.warn(`Cannot map item to diagram: ${JSON.stringify(item)}`);
        });

        if (this.options.generateAllLinks || this.options.generateLinksFromExtends) {
            createdEntities.forEach((entity) => {
                if (!entity.parentExtend) {
                    return;
                }

                result.addLink(DiagramLink.Generalization(entity.parentExtend.className ?? entity.parentExtend.name ?? "", entity.name));
            });
        }
        if (this.options.generateAllLinks || this.options.generateLinksFromInterfaces) {
            createdEntities.forEach((entity) => {
                if (!entity.parentImplements?.length) {
                    return;
                }
                entity.parentImplements.forEach((parentImplement) => {
                    result.addLink(DiagramLink.Realization(parentImplement.className ?? parentImplement.name ?? "", entity.name));
                });
            });
        }

        return result;
    }

    private parsePrimitive(content: string, options: ClassDiagramParserOptions): { name: string, type: string, elementType: DiagramElementType.PRIMITIVE } | null {
        const match = content.match(/type\W+([a-zA-Z0-6_-]+)\W+=\W([a-zA-Z0-6_-]+)/);

        if (!match) {
            return null;
        }

        return {
            elementType: DiagramElementType.PRIMITIVE,
            name       : match[1],
            type       : match[2],
        };
    }


    private parseEntity(content: string): DiagramEntity {
        const {modifiers, name, bodyRows, type, rawExtends, rawImplements} = this.classParser.parseEntityBasic(content);

        const factory = new DiagramEntityFactory<DiagramEntity>(type, name);
        factory.setAbstract(modifiers.abstract);

        switch (type) {
            case DiagramEntityType.ENUM:
                this.enumParser.parseEnumBody(bodyRows, factory);
                this.enumParser.parseExtends(rawExtends, factory);
                this.enumParser.parseImplements(rawImplements, factory);
                break;
            default:
                this.classParser.parseClassBody(bodyRows, factory);
                this.classParser.parseExtends(rawExtends, factory);
                this.classParser.parseImplements(rawImplements, factory);
        }

        return factory.build();
    }
}
