import * as go from "gojs";
import { DiagramAccessModifier } from "../../class/common/diagram-access-modifier";
import { DiagramTypeToString } from "../../class/common/diagram-type";
import { DiagramCheckers } from "../../diagram-checkers";
import { DiagramModel } from "../../model/diagram-model";
import { GojsData, GojsLinkData, GojsNodeData } from "./gojs-data";

const $ = go.GraphObject.make;

function getData(diagram: DiagramModel, onlyTypes?: string[]): GojsData {
    const nodeData: GojsNodeData[] = [];
    const linkData: GojsLinkData[] = [];
    const entityNameKeyMap         = new Map<string, number>();

    const requireKeyFor = (entityName: string): number => {
        const existingKey = entityNameKeyMap.get(entityName);
        if (existingKey) {
            return existingKey;
        }
        const newKey = entityNameKeyMap.size + 1;
        entityNameKeyMap.set(entityName, newKey);

        return newKey;

    };

    diagram.forEachEntity((entity) => {
        const key = requireKeyFor(entity.name);

        const methods: GojsNodeData["methods"] = [];

        if (DiagramCheckers.isClass(entity) || DiagramCheckers.isInterface(entity)) {
            methods.push(...entity.methods.map((method) => ({
                name      : method.name,
                entityType: entity.type,
                type      : DiagramTypeToString(method.returnType),
                parameters: (method.parameters ?? []).map((parameter) => ({
                    name: parameter.name,
                    type: DiagramTypeToString(parameter.type),
                })),
                visibility: method.access ?? DiagramAccessModifier.PUBLIC,
            })));
        }
        nodeData.push({
            key,
            methods   : methods.length ? methods : undefined,
            name      : entity.name,
            entityType: entity.type,
            properties: entity.properties.map((property) => ({
                name      : property.name,
                type      : DiagramTypeToString(property.type),
                visibility: property.access ?? DiagramAccessModifier.PUBLIC,
            })),
        });
    });

    diagram.forEachLink((link) => {
        const toName   = link.to.className ?? link.to.name ?? "";
        const fromName = link.from.className ?? link.from.name ?? "";

        const to   = requireKeyFor(toName);
        const from = requireKeyFor(fromName);
        if (!to) {
            throw new Error(`Cannot get index for 'to' name ${toName}(${JSON.stringify(link.to)})`);
        }

        if (!from) {
            throw new Error(`Cannot get index for 'from' name ${fromName}(${JSON.stringify(link.from)})`);
        }
        linkData.push({to, from, relationship: link.type});
    });

    if (onlyTypes) {
        const filteredNodeData = nodeData.filter((node) => onlyTypes.includes(node.name));

        return {
            nodeData: filteredNodeData,
            linkData: linkData.filter((link) =>
                filteredNodeData.some((item) => item.key === link.from) &&
                filteredNodeData.some((item) => item.key === link.to)),
        };
    }

    return {
        nodeData,
        linkData,
    };
}


/**
 * Same as {@link go.Model.toJson}
 * @param diagram
 * @param onlyTypes
 */
export function getGoModelJSONFromModel(diagram: DiagramModel, onlyTypes?: string[]): string {
    const data = getData(diagram, onlyTypes);

    return JSON.stringify({
        class             : "GraphLinksModel",
        copiesArrays      : true,
        copiesArrayObjects: true,
        nodeDataArray     : data.nodeData,
        linkDataArray     : data.linkData,
    });
}

export function getGoModelFromModel(diagram: DiagramModel, onlyTypes?: string[]): go.Model {
    const data = getData(diagram, onlyTypes);

    // set up a few example class nodes and relationships
    return $(go.GraphLinksModel,
        {
            copiesArrays      : true,
            copiesArrayObjects: true,
            nodeDataArray     : data.nodeData,
            linkDataArray     : data.linkData,
        });

}
