import "mocha";
import {PackageElementData, Uml25ToPackageElementData} from "./uml-2.5-to-package-element-data";
import * as fs from "fs";
import {packageElementDataToDiagram} from "./package-element-data-to-diagram";

describe("Test umlToJson convertor", () => {
    it("Basic conversion", () => {

        const parser = new Uml25ToPackageElementData();
        const xmlContent = fs.readFileSync(__dirname + "/voxel.xml", {encoding: "utf8"});

        const result = parser.parse(xmlContent);
        const parsedResult = packageElementDataToDiagram(result.children[4] as PackageElementData);
        console.log(result);
    });
});
