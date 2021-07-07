import { DiagramTypeName, ParseDiagramType } from "../class/common/diagram-type";
import { DiagramEntityFactory } from "../class/diagram-entity-factory";
import { DiagramEntity } from "../class/entity/diagram-entity";
import { DiagramModel } from "../model/diagram-model";
import { ElementData, PackageElementData } from "./uml-2.5-to-package-element-data";


function processSingle(data: ElementData): DiagramEntity {
    const factory = DiagramEntityFactory.createClass(data.name);

    data.attributes.forEach((attribute) => {
        factory.addPropertyRaw({
            name  : attribute.name,
            type  : {
                array    : attribute.array,
                name     : DiagramTypeName.LINK,
                className: attribute.type,
            },
            final : attribute.changeability === "true",
            access: attribute.accessor,
        });
    });

    data.operations.forEach((method) => {
        factory.addMethodRaw({
            name      : method.name,
            abstract  : method.abstract,
            access    : method.accessor,
            static    : method.static,
            returnType: ParseDiagramType(method.returnType),
            parameters: (method.parameters ?? []).map((parameter, index) => ({
                index,
                type: ParseDiagramType(parameter.type),
                name: `parameter${index}`,
            })),
        });
    });

    return factory.build();
}

function processRecursive(data: PackageElementData | ElementData, model: DiagramModel): void {
    const children = (data as PackageElementData).children;
    if (Array.isArray(children)) {
        children.forEach((child) => processRecursive(child, model));
    }

    switch (data.type) {
        case "CLASS":
        case "INTERFACE":
            model.addEntity(processSingle(data));
    }
}

export function packageElementDataToDiagram(data: PackageElementData): DiagramModel {
    const model = new DiagramModel();
    processRecursive(data, model);

    return model;
}
