import { DiagramType, DiagramTypeName, DiagramTypeToString } from "../../class/common/diagram-type";
import { DiagramCheckers } from "../../diagram-checkers";
import { DiagramModel } from "../../model/diagram-model";
import { DiagramRawData } from "../diagram-raw-data";

export class DiagramToString {
    public serialize(model: DiagramModel): string {
        const result: DiagramRawData | any = {
            diagrams: [],
            model   : {
                entities: [],
                packages: [],
            },
        };


        let idCounter = 0;
        const idMap   = new Map<string, string>();

        const getId = (item?: string): string => {
            if (!item) {
                throw new Error(`Cannot get id for name '${item}'`);
            }
            if (item in DiagramTypeName) {
                return item;
            }

            const existingId = idMap.get(item);
            if (existingId) {
                return existingId;
            }

            // const newId = `entity:${item}:${idCounter++}`;
            const newId = `${idCounter++}`;
            idMap.set(item, newId);

            return newId;
        };

        const typeToString = (type: DiagramType): string => {
            if (type.name === DiagramTypeName.LINK) {
                if (type.array) {
                    return `${getId(type.className)}[]`;
                }

                return getId(type.className);
            }

            return getId(DiagramTypeToString(type));
        };

        model.forEachEntity((entity) => {
            const rawEntity: Partial<DiagramRawData["model"]["entities"][0]> | any = {
                name    : entity.name,
                id      : getId(entity.name),
                type    : entity.type,
                generics: [],
            };

            if (entity.parentImplements) {
                rawEntity.implements = entity.parentImplements.map((e) => typeToString(e));
            }
            if (entity.parentExtend) {
                rawEntity.extends = [typeToString(entity.parentExtend)];
            }
            if (entity.properties) {
                rawEntity.properties = entity.properties.map((property) => ({
                    type        : typeToString(property.type),
                    name        : property.name,
                    access      : property.access,
                    abstract    : property.abstract,
                    defaultValue: property.defaultValue,
                    final       : property.final,
                    optional    : property.optional,
                    static      : property.static,
                }));
            }
            if (DiagramCheckers.isClass(entity) || DiagramCheckers.isInterface(entity)) {
                if (entity.generics) {
                    rawEntity.generics = entity.generics.map((generic) => ({
                        defaultValue: generic.defaultValue ? typeToString(generic.defaultValue) : undefined,
                        extends     : generic.extends ? typeToString(generic.extends) : undefined,
                        name        : generic.name,
                    }));
                }
                if (entity.methods) {
                    rawEntity.methods = entity.methods.map((method) => ({
                        returnType: typeToString(method.returnType),
                        name      : method.name,
                        access    : method.access,
                        abstract  : method.abstract,
                        final     : method.final,
                        optional  : method.optional,
                        static    : method.static,
                        parameters: (method.parameters?.length ?? 0 > 1) ? method.parameters?.map((parameter) => ({
                            name        : parameter.name,
                            type        : typeToString(parameter.type),
                            defaultValue: parameter.defaultValue,
                            optional    : parameter.optional,
                        })) : undefined,
                        generics  : (method.generics?.length ?? 0 > 1) ? method.generics?.map((generic) => ({
                            defaultValue: generic.defaultValue ? typeToString(generic.defaultValue) : undefined,
                            extends     : generic.extends ? typeToString(generic.extends) : undefined,
                            name        : generic.name,
                        })) : undefined,
                    }));
                }
            }

            result.model.entities.push(rawEntity);
        });

        return JSON.stringify(result);
    }
}
