import "mocha";
import {expect} from "chai";
import {DiagramModel} from "../model/diagram-model";
import {DiagramEntityFactory} from "./diagram-entity-factory";
import {DiagramType, DiagramTypeNames} from "./common/diagram-type";
import {DiagramAccessModifier} from "./common/diagram-access-modifier";


function createAdvancedModel(): DiagramModel {
    const personClass = DiagramEntityFactory.createClass("Person")
        .addPublicProperty("Age", DiagramType.Number)
        .addPublicProperty("Children", {name: DiagramTypeNames.LINK, className: "Person", array: true})
        .addPublicProperty("Name", DiagramType.String, "Jon Doe")
        .addProperty("Type", DiagramType.String, DiagramAccessModifier.PUBLIC, {
            static: true,
            final: true,
            defaultValue: "Person",
        })
        .addPublicFinalProperty("Id", {name: "UUID"})
        .addPublicMethod("introduce", DiagramType.String)
        .addGenerics({
            name: "GENDER",
            defaultValue: DiagramType.Union("MAN", "WOMAN", "UNKNOWN"),
            extends: DiagramType.String,
        })
        .addPublicMethod("setGender", DiagramType.Void, {
            name: "gender",
            type: {name: "GENDER"},
            defaultValue: "UNKNOWN",
        })
        .addPublicGenericMethod(
            "setName",
            DiagramType.Void,
            [
                {
                    name: "T",
                    extends: DiagramType.String,
                },
            ],
            {
                name: "name",
                type: {name: "T"},
            },
            {
                name: "validate",
                type: DiagramType.Boolean,
                optional: true,
            },
        )
        .build();

    const model = new DiagramModel();

    model.addEntity(personClass);
    model.defineType({name: "UUID"});

    return model;
}

function createSimpleModel(): DiagramModel {
    const dateClass = DiagramEntityFactory.createClass("Date")
        .addPublicProperty("day", DiagramType.Number)
        .addPublicProperty("year", DiagramType.Number)
        .addPublicProperty("month", DiagramType.Number)
        .build();

    const personClass = DiagramEntityFactory.createClass("Person")
        .addPublicProperty("Gender", DiagramType.Union("MALE", "FEMALE"))
        .addPublicProperty("givenName", DiagramType.String)
        .addPublicProperty("familyName", DiagramType.String)
        .addPublicProperty("birthday", DiagramType.Link("Date"))
        .build();

    const model = new DiagramModel();

    model.addEntity(personClass);
    model.addEntity(dateClass);

    return model;
}


describe("Test basic diagram validation", () => {
    it("Validate diagrams", async () => {
        const simpleDiagram = createSimpleModel();
        const advancedModel = createAdvancedModel();
        expect(simpleDiagram.validate()).to.deep.equal({
            errors: [],
            resultCode: "SUCCESS",
            warnings: [],
        });
        expect(advancedModel.validate()).to.deep.equal({
            errors: [],
            resultCode: "SUCCESS",
            warnings: [],
        });
    });
});
