import { DiagramAccessModifier } from "../class/common/diagram-access-modifier";
import { DiagramGenericToString } from "../class/common/diagram-generic";
import { DiagramTypeName, DiagramTypeToString } from "../class/common/diagram-type";
import { DiagramEntity } from "../class/entity/diagram-entity";
import { DiagramEntityType } from "../class/entity/diagram-entity-type";
import { DiagramCheckers } from "../diagram-checkers";
import { DiagramModel } from "../model/diagram-model";

/**
 * TODO: think about patterns
 *    :: mean :
 *    - TS {
 *        param: `:name:optional:: :type = :default`
 *        method: `:access :modifiers :name(:params):: :return`
 *    }
 *    - JS {
 *        param: `:name = :default`
 *        method: `:modifiers :name(:params)`
 *    }
 *    - Java {
 *        param: `:type :name`
 *        method: `:access :modifiers :return :name(:params)`
 *    }
 */
export class LanguageExporter {
    public constructor(private readonly options: {
        keywords: {
            static: string, //"static",
            final: string, // "final", const, readonly
            abstract: string, //"abstract",
        },
        parameters?: "newLine" | "newLineIfMultiline",
        modifierOrder: ("static" | "final" | "abstract")[]
        defaultAccessor: DiagramAccessModifier,
        ignoreTypes?: boolean
        typeNameMap: { [name: string]: string },
        entityTypeMap: {
            [type in DiagramEntityType]?: string
        }
        accessorMap: {
            [access in DiagramAccessModifier]?: string
        }
        indent: number,
    }) {
    }

    public static typescript(params: Partial<{
        indent: number;
        typeNameMap: { [name: string]: string };
        defaultAccessor: DiagramAccessModifier
    }> = {}): LanguageExporter {
        return new LanguageExporter({
            indent         : params.indent ?? 4,
            keywords       : {
                abstract: "abstract",
                final   : "readonly",
                static  : "static",
            },
            entityTypeMap  : {
                [DiagramEntityType.CLASS]    : "class",
                [DiagramEntityType.INTERFACE]: "interface",
                [DiagramEntityType.ENUM]     : "enum",
            },
            parameters     : "newLineIfMultiline",
            typeNameMap    : {
                [DiagramTypeName.BOOLEAN]: "boolean",
                [DiagramTypeName.STRING] : "string",
                [DiagramTypeName.NUMBER] : "number",
                [DiagramTypeName.VOID]   : "void",
                [DiagramTypeName.UNKNOWN]: "unknown",
                ...(params.typeNameMap ?? {}),
            },
            defaultAccessor: params.defaultAccessor ?? DiagramAccessModifier.PUBLIC,
            accessorMap    : {
                [DiagramAccessModifier.PUBLIC]   : "public",
                [DiagramAccessModifier.PRIVATE]  : "private",
                [DiagramAccessModifier.PROTECTED]: "protected",
            },
            modifierOrder  : undefined as any,
        });
    }

    public static java(params: Partial<{
        indent: number;
        typeNameMap: { [name: string]: string };
        defaultAccessor: DiagramAccessModifier
    }> = {}): LanguageExporter {
        return new LanguageExporter({
            indent         : params.indent ?? 4,
            keywords       : {
                abstract: "abstract",
                final   : "final",
                static  : "static",
            },
            entityTypeMap  : {
                [DiagramEntityType.CLASS]    : "class",
                [DiagramEntityType.INTERFACE]: "interface",
                [DiagramEntityType.ENUM]     : "class",
            },
            parameters     : "newLineIfMultiline",
            typeNameMap    : {
                [DiagramTypeName.BOOLEAN]: "boolean",
                [DiagramTypeName.STRING] : "String",
                [DiagramTypeName.NUMBER] : "number",
                [DiagramTypeName.VOID]   : "void",
                [DiagramTypeName.UNKNOWN]: "unknown",
                ...(params.typeNameMap ?? {}),
            },
            defaultAccessor: params.defaultAccessor ?? DiagramAccessModifier.PUBLIC,
            accessorMap    : {
                [DiagramAccessModifier.PUBLIC]   : "public",
                [DiagramAccessModifier.PRIVATE]  : "private",
                [DiagramAccessModifier.PROTECTED]: "protected",
                [DiagramAccessModifier.PACKAGE]  : "package",
            },
            modifierOrder  : undefined as any,
        });
    }

    public static javascript(params: Partial<{
        indent: number;
        typeNameMap: { [name: string]: string };
        defaultAccessor: DiagramAccessModifier
    }> = {}): LanguageExporter {
        return new LanguageExporter({
            indent         : params.indent ?? 4,
            keywords       : {
                abstract: "abstract",
                final   : "",
                static  : "static",
            },
            ignoreTypes    : true,
            entityTypeMap  : {
                [DiagramEntityType.CLASS]    : "class",
                [DiagramEntityType.INTERFACE]: "",
                [DiagramEntityType.ENUM]     : "class",
            },
            parameters     : "newLineIfMultiline",
            typeNameMap    : {
                [DiagramTypeName.BOOLEAN]: "boolean",
                [DiagramTypeName.STRING] : "string",
                [DiagramTypeName.NUMBER] : "number",
                [DiagramTypeName.VOID]   : "void",
                [DiagramTypeName.UNKNOWN]: "unknown",
                ...(params.typeNameMap ?? {}),
            },
            defaultAccessor: params.defaultAccessor ?? DiagramAccessModifier.PUBLIC,
            accessorMap    : {
                [DiagramAccessModifier.PUBLIC]   : "",
                [DiagramAccessModifier.PRIVATE]  : "",
                [DiagramAccessModifier.PROTECTED]: "",
            },
            modifierOrder  : undefined as any,
        });
    }

    public getString(model: DiagramModel): string {
        const entitiesString: string[] = [];

        model.forEachEntity((entity) => {
            if (this.options.ignoreTypes && DiagramCheckers.isInterface(entity)) {
                return;
            }
            entitiesString.push(this.getEntityString(entity));
        });

        return entitiesString.join("\n\n");
    }

    /**
     * TODO:
     *  - if ignore types then remove abstract modifier;
     *  - add methods body if it exists
     *  - implements method generics
     * @param entity
     * @private
     */
    private getEntityString(entity: DiagramEntity): string {
        const SPACE         = " ";
        const INDENT        = this.options.indent ?? 4;
        const TAB           = SPACE.repeat(INDENT);
        const BREAK         = "\n";
        const CLOSURE_BEGIN = "{";
        const CLOSURE_END   = "}";

        const entityAccessor           = entity.access ?? this.options.defaultAccessor ?? DiagramAccessModifier.PUBLIC;
        const entitiesString: string[] = [
            this.options.accessorMap[entityAccessor] ?? entityAccessor,
            SPACE,
        ];

        if (DiagramCheckers.isClass(entity)) {
            (this.options.modifierOrder ?? ["abstract", "final", "static"]).forEach((modifier) => {
                if (entity[modifier]) {
                    entitiesString.push(
                        this.options.keywords[modifier] ?? modifier,
                        SPACE,
                    );
                }
            });
        }
        entitiesString.push(
            this.options.entityTypeMap[entity.type] ?? entity.type,
            SPACE,
            entity.name,
            /* TODO:
             *   - generics,
             *   - extends/implements
             */
            SPACE,
        );

        if (entity.parentExtend) {
            entitiesString.push(
                "extends",
                SPACE,
                DiagramTypeToString(entity.parentExtend, this.options.typeNameMap),
                SPACE,
            );
        }

        if (!this.options.ignoreTypes) {
            if (entity.parentImplements?.length) {
                entitiesString.push(
                    "implements",
                    SPACE,
                    entity.parentImplements.map((e) => DiagramTypeToString(e, this.options.typeNameMap)).join(", "),
                    SPACE,
                );
            }

            if (DiagramCheckers.isClass(entity) || DiagramCheckers.isInterface(entity)) {
                if (entity.generics?.length) {
                    entitiesString.push(
                        "<",
                        entity.generics.map((g) => DiagramGenericToString(g, this.options.typeNameMap)).join(", "),
                        ">",
                    );
                }
            }
        }

        entitiesString.push(
            CLOSURE_BEGIN,
            BREAK,
        );

        const propertiesString: string[] = [];
        entity.properties.forEach((property) => {
            const propertyAccessor         = property.access ?? this.options.defaultAccessor ?? DiagramAccessModifier.PUBLIC;
            const propertyString: string[] = [
                TAB,
                this.options.accessorMap[propertyAccessor] ?? propertyAccessor,
                SPACE,
            ];

            (this.options.modifierOrder ?? ["abstract", "final", "static"]).forEach((modifier) => {
                if (property[modifier]) {
                    propertyString.push(
                        this.options.keywords[modifier] ?? modifier,
                        SPACE,
                    );
                }
            });

            propertyString.push(
                property.name,
            );
            if (!this.options.ignoreTypes) {
                if (property.optional) {
                    propertyString.push("?");
                }
                if (property.type) {
                    propertyString.push(
                        ":",
                        SPACE,
                        DiagramTypeToString(property.type, this.options.typeNameMap),
                    );
                }
            }
            if (property.defaultValue) {
                propertyString.push(
                    SPACE,
                    "=",
                    SPACE,
                    property.defaultValue,
                );
            }

            propertyString.push(";");

            return propertiesString.push(
                propertyString.join(""),
            );
        });

        entitiesString.push(propertiesString.join(BREAK.repeat(2)));

        if (DiagramCheckers.isClass(entity) || DiagramCheckers.isInterface(entity)) {
            const methodsString: string[] = [];
            entity.methods.forEach((method) => {
                const methodAccessor         = method.access ?? this.options.defaultAccessor ?? DiagramAccessModifier.PUBLIC;
                const methodString: string[] = [
                    TAB,
                    this.options.accessorMap[methodAccessor] ?? methodAccessor,
                    SPACE,
                ];

                (this.options.modifierOrder ?? ["abstract", "final", "static"]).forEach((modifier) => {
                    if (method[modifier]) {
                        entitiesString.push(
                            this.options.keywords[modifier] ?? modifier,
                            SPACE,
                        );
                    }
                });

                methodString.push(
                    method.name,
                    "(",
                );

                if (method.parameters) {
                    const parameters: string[] = [];
                    method.parameters.forEach((param) => {
                        const parameterStrings: string[] = [
                            param.name,
                        ];
                        if (!this.options.ignoreTypes) {
                            if (param.optional) {
                                parameterStrings.push("?");
                            }
                            if (param.type) {
                                parameterStrings.push(
                                    ":",
                                    SPACE,
                                    DiagramTypeToString(param.type, this.options.typeNameMap),
                                );
                            }
                        }
                        if (param.defaultValue) {
                            parameterStrings.push(
                                SPACE,
                                "=",
                                SPACE,
                                param.defaultValue,
                            );
                        }

                        parameters.push(parameterStrings.join(""));
                    });

                    if (this.options.parameters === "newLine") {
                        methodString.push(
                            BREAK,
                            parameters.map((p) => `${TAB.repeat(2)}${p}\n`).join(""),
                            TAB,
                        );
                    } else if (this.options.parameters === "newLineIfMultiline") {
                        if (parameters.length > 1) {
                            methodString.push(
                                BREAK,
                                parameters.map((p) => `${TAB.repeat(2)}${p}\n`).join(""),
                                TAB,
                            );
                        } else {
                            methodString.push(parameters.join(", "));
                        }
                    } else {
                        methodString.push(parameters.join(", "));
                    }
                }

                methodString.push(
                    ")",
                );

                if (!this.options.ignoreTypes && method.returnType) {
                    methodString.push(`: ${DiagramTypeToString(method.returnType, this.options.typeNameMap)}`);
                }
                methodString.push(";");

                methodsString.push(methodString.join(""));
            });

            entitiesString.push(methodsString.join(BREAK.repeat(2)));
        }


        entitiesString.push(
            BREAK,
            CLOSURE_END,
            BREAK,
        );

        return entitiesString.join("");
    }
}
