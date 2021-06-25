import {DiagramModel} from "../../model/diagram-model";
import * as fs from "fs";
import {getGoModelJSONFromModel} from "../../conversions/diagram-to-gojs-data";
import {DiagramParser} from "../../conversions/text-to-diagram/diagram-parser";

function loadFileContentToModel(file: string): DiagramModel {
    const content = fs.readFileSync(file, {encoding: "utf8"});

    const parser = new DiagramParser({
        entityDivider: "//--",
        generateLinksFromExtends: true,
        generateLinksFromInterfaces: true,
    });

    return parser.parseToDiagram(content);
}

export function createWorldModel(): DiagramModel {
    // const worldModel = new DiagramModel();
    const worldModel = loadFileContentToModel(__dirname + "/diagram-model.ts");

    worldModel.defineType({name: "WorldUnit"});
    worldModel.defineType({name: "Range"});
    worldModel.defineType({name: "Observable"});

    // addBuildingItemsToModel(worldModel);
    // addBotItemsToModel(worldModel);


    fs.writeFileSync(__dirname + "/diagram2.js", `const diagramData = ${JSON.stringify(getGoModelJSONFromModel(worldModel))}`);

    return worldModel;
}
