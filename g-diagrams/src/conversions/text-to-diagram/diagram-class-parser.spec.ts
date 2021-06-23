import "mocha";
import {expect} from "chai";
import {DiagramClassParser} from "./diagram-class-parser";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {DiagramEntityType} from "../../class/entity/diagram-entity-type";
import {DiagramParserTexts} from "./diagram-parser-texts";
import {DiagramElementType} from "../../class/common/diagram-element-type";
import {DiagramAccessModifier} from "../../class/common/diagram-access-modifier";


describe("Test text to diagram parser", () => {
    it("Parse basic text", async () => {
        const parser = new DiagramClassParser();
        const {type, bodyRows, name} = parser.parseEntityBasic(DiagramParserTexts.classAttributes1);


        expect(type).to.be.equal(DiagramEntityType.CLASS);

        const factory = DiagramEntityFactory.createClass(name);
        parser.parseClassBody(bodyRows, factory);
        const parsedDiagram = factory.build();
        console.log(JSON.stringify(parsedDiagram));

        expect(parsedDiagram).to.exist;
        expect(parsedDiagram.elementType).to.be.equal(DiagramElementType.ENTITY);
        expect(parsedDiagram.name).to.be.equal("Person");
        expect(parsedDiagram.access).to.be.equal(DiagramAccessModifier.PUBLIC);
        expect(parsedDiagram.type).to.be.equal(DiagramEntityType.CLASS);

        expect(parsedDiagram.type).to.be.equal(DiagramEntityType.CLASS);

        expect(parsedDiagram).to.not.deep.equal(
            {
                "elementType": "ENTITY",
                "name": "Person",
                "access": "PUBLIC",
                "type": "CLASS",
                "properties": [{
                    "name": "Name",
                    "type": {"name": "UNKNOWN"},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "elementType": "PROPERTY",
                }, {
                    "name": "Age",
                    "type": {"name": "NUMBER"},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "elementType": "PROPERTY",
                }, {
                    "name": "SurName;",
                    "type": {"name": "UNKNOWN"},
                    "final": true,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "elementType": "PROPERTY",
                }, {
                    "name": "FavouriteNumbers",
                    "type": {"name": "NUMBER", "array": true},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "elementType": "PROPERTY",
                }, {
                    "name": "NickNames",
                    "type": {"name": "STRING", "array": true},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "elementType": "PROPERTY",
                }, {
                    "name": "Gender",
                    "defaultValue": "\"unknown\"",
                    "type": {"name": "STRING"},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "value": " \"unknown\"",
                    "elementType": "PROPERTY",
                }, {
                    "name": "MiddleName?",
                    "type": {"name": "STRING"},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "elementType": "PROPERTY",
                }, {
                    "name": "Alias?",
                    "defaultValue": "\"none\"",
                    "type": {"name": "STRING"},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "value": " \"none\"",
                    "elementType": "PROPERTY",
                }, {
                    "name": "FavouriteLetter",
                    "defaultValue": "\"g\"",
                    "type": {"name": "UNKNOWN"},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "value": " \"g\"",
                    "elementType": "PROPERTY",
                }, {
                    "name": "#address",
                    "type": {"name": "LINK", "className": "Address"},
                    "final": false,
                    "abstract": false,
                    "static": false,
                    "access": "PUBLIC",
                    "optional": false,
                    "elementType": "PROPERTY",
                }],
                "methods": [],
                "generics": [],
                "abstract": false,
                "parentImplements": [],
            },
        );
    });
});
