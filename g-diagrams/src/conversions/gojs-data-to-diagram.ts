import {GojsData} from "./text-to-diagram/gojs-data";
import {DiagramModel} from "../model/diagram-model";
import {DiagramType, ParseDiagramType} from "../class/common/diagram-type";
import {DiagramEntityFactory} from "../class/diagram-entity-factory";

export function GojsDataToDiagram(data: GojsData): DiagramModel {
    const model = new DiagramModel();

    const nodeKeyNameMap = new Map<number, string>();

    data.nodeData.forEach((node) => {
        nodeKeyNameMap.set(node.key, node.name);

        const factory = new DiagramEntityFactory(node.entityType, node.name);

        node.properties.forEach((property) => {
            factory.addPropertyRaw({
                name: property.name,
                type: ParseDiagramType(property.type),
                access: property.visibility,
            });
        });
        (node.methods ?? []).forEach((method) => {
            factory.addMethodRaw({
                name: method.name,
                returnType: ParseDiagramType(method.type),
                access: method.visibility,
                parameters: method.parameters.map((parameter) => ({
                    name: parameter.name,
                    type: ParseDiagramType(parameter.type),
                })),
            });
        });
    });

    data.linkData.forEach((link) => {
        const from = nodeKeyNameMap.get(link.from);
        const to = nodeKeyNameMap.get(link.to);

        if (!from) {
            throw new Error("Cannot find from object by key " + link.from);
        }

        if (!to) {
            throw new Error("Cannot find to object by key " + link.to);
        }

        model.addLink({
            from: DiagramType.Link(from),
            to: DiagramType.Link(to),
            type: link.relationship,
        });
    });

    return model;
}
