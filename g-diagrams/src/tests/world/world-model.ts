import {DiagramModel} from "../../model/diagram-model";
import * as fs from "fs";
import {getGoModelFromModel} from "../../conversions/diagram-to-gojs-data";
import {addBotItemsToModel} from "./bots";


export function createWorldModel(): DiagramModel {
    const worldModel = new DiagramModel();

    worldModel.defineType({name: "WorldUnit"});
    worldModel.defineType({name: "Range"});
    worldModel.defineType({name: "Observable"});

    // addBuildingItemsToModel(worldModel);
    addBotItemsToModel(worldModel);

    const goModel = getGoModelFromModel(worldModel);
    fs.writeFileSync(__dirname + "/diagram.js", `const diagramData = ${JSON.stringify(goModel.toJson())}`);

    return worldModel;
}
