import { expect } from "chai";
import "mocha";
import { DiagramAccessModifier } from "../class/common/diagram-access-modifier";
import { DiagramElementType } from "../class/common/diagram-element-type";
import { DiagramWorldContext } from "./diagram-world-context";


describe("Test World context", () => {
    it("test empty context validations", async () => {
        const context = new DiagramWorldContext();

        expect(context.validate()).to.deep.equal({
            errors    : [],
            warnings  : [],
            resultCode: "SUCCESS",
        });
    });

    it("test basic context validations", async () => {
        const context = new DiagramWorldContext();
        context.addProperty({
            name       : "someProperty",
            access     : DiagramAccessModifier.PUBLIC,
            elementType: DiagramElementType.PROPERTY,
            // value: DiagramType.Boolean,
            type: {
                name: "GABO",
            },
        });
        expect(context.validate()).to.deep.equal({
            errors    : [
                {
                    message: "Cannot resolve global variable 'someProperty'",
                },
            ],
            warnings  : [],
            resultCode: "ERROR",
        });

        context.defineTypes({name: "GABO"});

        expect(context.validate()).to.deep.equal({
            errors    : [],
            warnings  : [],
            resultCode: "SUCCESS",
        });
    });
});
