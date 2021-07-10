import { DiagramAccessModifier } from "../class/common/diagram-access-modifier";
import { DiagramTypeToString } from "../class/common/diagram-type";
import { DiagramEntityType } from "../class/entity/diagram-entity-type";
import { DiagramCheckers } from "../diagram-checkers";
import { DiagramLinkType } from "../model/diagram-link-type";
import { DiagramModel } from "../model/diagram-model";

export class DiagramToMermaid {
    private readonly accessMap: { [accessor in DiagramAccessModifier]: string } = {
        [DiagramAccessModifier.PUBLIC]   : "+",
        [DiagramAccessModifier.PRIVATE]  : "-",
        [DiagramAccessModifier.PROTECTED]: "/",
        [DiagramAccessModifier.PACKAGE]  : "~",
    }
    private readonly diagramTypeNames: { [name: string]: string }               = {};
    private readonly entityTypeMap: { [type in DiagramEntityType]: string }     = {
        [DiagramEntityType.CLASS]    : "class",
        [DiagramEntityType.INTERFACE]: "interface",
        [DiagramEntityType.ENUM]     : "enum",
    };
    private readonly linkTypeMap: { [type in DiagramLinkType]: string }         = {
        [DiagramLinkType.REALIZATION]   : "<|..",
        [DiagramLinkType.GENERALIZATION]: "<|--",
        [DiagramLinkType.AGGREGATION]   : "o--",
        [DiagramLinkType.COMPOSITION]   : "*--",
    };

    public modelToDiagram(model: DiagramModel): string {
        const resultTokens: string[] = [
            "classDiagram",
        ];

        const linkTokens: string[] = [];


        model.forEachEntity((entity) => {
            const entityToken: string[] = [
                `${"class" ?? this.entityTypeMap[entity.type]} ${entity.name}{`,
            ];

            if (DiagramCheckers.isInterface(entity)) {
                entityToken.push("<<interface>>");
            }
            if (DiagramCheckers.isEnum(entity)) {
                entityToken.push("<<enum>>");
            }

            if (entity.parentExtend) {
                linkTokens.push(`${entity.parentExtend.className} ${this.linkTypeMap[DiagramLinkType.GENERALIZATION]} ${entity.name}`);
            }
            if (entity.parentImplements) {
                linkTokens.push(...entity.parentImplements.map((e) => `${e.className} ${this.linkTypeMap[DiagramLinkType.REALIZATION]} ${entity.name}`));
            }

            entity.properties.forEach((property) => {
                const propertyTokens: string[] = [
                    this.accessMap[property.access ?? DiagramAccessModifier.PUBLIC],
                ];

                if (property.type) {
                    propertyTokens.push(
                        DiagramTypeToString(property.type, this.diagramTypeNames),
                        " ",
                    );
                }
                propertyTokens.push(property.name);
                entityToken.push(propertyTokens.join(""));
            });

            if (DiagramCheckers.isClass(entity) || DiagramCheckers.isInterface(entity)) {
                entity.methods.forEach((method) => {
                    const propertyTokens: string[] = [
                        this.accessMap[method.access ?? DiagramAccessModifier.PUBLIC],
                    ];
                    propertyTokens.push(method.name);

                    propertyTokens.push("(");

                    propertyTokens.push(")");

                    if (method.returnType) {
                        propertyTokens.push(
                            " ",
                            DiagramTypeToString(method.returnType, this.diagramTypeNames),
                        );
                    }
                    entityToken.push(propertyTokens.join(""));
                });
            }

            entityToken.push(
                "}",
            );
            if (entityToken.length > 2) {
                resultTokens.push(entityToken.join("\n"));
            } else {
                resultTokens.push(`${"class" ?? this.entityTypeMap[entity.type]} ${entity.name}`);
            }
        });


        resultTokens.push(...linkTokens);

        return resultTokens.join("\n");
    }
}
