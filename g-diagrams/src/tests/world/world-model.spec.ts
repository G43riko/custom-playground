import "mocha";
import {expect} from "chai";
import {createWorldModel} from "./world-model";
import {DiagramModel} from "../../model/diagram-model";


describe("Test World model", () => {
    it("Validate world model", async () => {

        const model = createWorldModel();


        console.log(DiagramModel.getAllRequiredTypesOfDiagramModel(model));
        expect(model.validate()).to.deep.equal({
            errors: [],
            warnings: [],
            resultCode: "SUCCESS",
        });
    });
});
