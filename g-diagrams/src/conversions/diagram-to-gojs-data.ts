import {DiagramModel} from "../model/diagram-model";
import {DiagramAccessModifier} from "../class/common/diagram-access-modifier";
import {DiagramCheckers} from "../diagram-checkers";
import {DiagramTypeToString} from "../class/common/diagram-type";
import * as go from "gojs";
import {GojsData, GojsLinkData, GojsNodeData} from "./text-to-diagram/gojs-data";

const $ = go.GraphObject.make;

function getData(diagram: DiagramModel): GojsData {
    const nodeData: GojsNodeData[] = [];
    const linkData: GojsLinkData[] = [];
    const entityNameKeyMap = new Map<string, number>();

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
                name: method.name,
                entityType: entity.type,
                type: DiagramTypeToString(method.returnType),
                parameters: (method.parameters ?? []).map((parameter) => ({
                    name: parameter.name,
                    type: DiagramTypeToString(parameter.type),
                })),
                visibility: method.access ?? DiagramAccessModifier.PUBLIC,
            })));
        }
        nodeData.push({
            key,
            methods: methods.length ? methods : undefined,
            name: entity.name,
            entityType: entity.type,
            properties: entity.properties.map((property) => ({
                name: property.name,
                type: DiagramTypeToString(property.type),
                visibility: property.access ?? DiagramAccessModifier.PUBLIC,
            })),
        });
    });

    diagram.forEachLink((link) => {
        const toName = link.to.className ?? link.to.name ?? "";
        const fromName = link.from.className ?? link.from.name ?? "";

        const to = requireKeyFor(toName);
        const from = requireKeyFor(fromName);
        if (!to) {
            throw new Error("Cannot get index for 'to' name " + toName + "(" + JSON.stringify(link.to) + ")");
        }

        if (!from) {
            throw new Error("Cannot get index for 'from' name " + fromName + "(" + JSON.stringify(link.from) + ")");
        }
        linkData.push({to, from, relationship: link.type});
    });


    return {
        nodeData,
        linkData,
    };
}


/**
 * Same as {@link go.Model.toJson}
 * @param diagram
 */
export function getGoModelJSONFromModel(diagram: DiagramModel): string {
    const data = getData(diagram);

    return JSON.stringify({
        class: "GraphLinksModel",
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: data.nodeData,
        linkDataArray: data.linkData,
    });
}

export function getGoModelFromModel(diagram: DiagramModel): go.Model {
    const data = getData(diagram);

    // setup a few example class nodes and relationships
    return $(go.GraphLinksModel,
        {
            copiesArrays: true,
            copiesArrayObjects: true,
            nodeDataArray: data.nodeData,
            linkDataArray: data.linkData,
        });

}
