import "mocha";
import {expect} from "chai";
import {DiagramClassParser} from "./diagram-class-parser";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {DiagramEntityType} from "../../class/entity/diagram-entity-type";
import {DiagramParserTexts} from "./diagram-parser-texts";
import {DiagramElementType} from "../../class/common/diagram-element-type";
import {DiagramAccessModifier} from "../../class/common/diagram-access-modifier";

describe("Test text to diagram parser", () => {
    it("Parse attributes", () => {
        const parser = new DiagramClassParser({
            prefixAccessorMap: {
                [DiagramAccessModifier.PRIVATE]: "_",
            },
        });

        expect(parser.parseProperty("name")).to.deep.equal({
            name: "name",
            type: {name: "UNKNOWN"},
            final: false,
            abstract: false,
            value: undefined,
            defaultValue: undefined,
            static: false,
            access: "PUBLIC",
            optional: false,
            elementType: "PROPERTY",
        });
        expect(parser.parseProperty("age: number")).to.deep.equal({
            name: "age",
            type: {name: "NUMBER"},
            final: false,
            abstract: false,
            value: undefined,
            defaultValue: undefined,
            static: false,
            access: "PUBLIC",
            optional: false,
            elementType: "PROPERTY",
        });
        expect(parser.parseProperty("readonly surname;")).to.deep.equal({
            name: "surname",
            type: {name: "UNKNOWN"},
            final: true,
            abstract: false,
            value: undefined,
            defaultValue: undefined,
            static: false,
            access: "PUBLIC",
            optional: false,
            elementType: "PROPERTY",
        });
        expect(parser.parseProperty("favouriteNumbers: number[]")).to.deep.equal({
            name: "favouriteNumbers",
            type: {name: "NUMBER", array: true},
            final: false,
            abstract: false,
            value: undefined,
            defaultValue: undefined,
            static: false,
            access: "PUBLIC",
            optional: false,
            elementType: "PROPERTY",
        });
        expect(parser.parseProperty("nickNames:string[];")).to.deep.equal({
            name: "nickNames",
            type: {name: "STRING", array: true},
            final: false,
            abstract: false,
            value: undefined,
            defaultValue: undefined,
            static: false,
            access: "PUBLIC",
            optional: false,
            elementType: "PROPERTY",
        });
        expect(parser.parseProperty("gender: string = 'UNKNOWN'")).to.deep.equal({
            name: "gender",
            type: {name: "STRING"},
            final: false,
            abstract: false,
            value: "'UNKNOWN'",
            defaultValue: "'UNKNOWN'",
            static: false,
            access: "PUBLIC",
            optional: false,
            elementType: "PROPERTY",
        });
        expect(parser.parseProperty("middleName?:string")).to.deep.equal({
            name: "middleName",
            type: {name: "STRING"},
            final: false,
            abstract: false,
            value: undefined,
            defaultValue: undefined,
            static: false,
            access: "PUBLIC",
            optional: true,
            elementType: "PROPERTY",
        });
        expect(parser.parseProperty("alias ? :string = 'none'")).to.deep.equal({
            name: "alias",
            type: {name: "STRING"},
            final: false,
            abstract: false,
            value: "'none'",
            defaultValue: "'none'",
            static: false,
            access: "PUBLIC",
            optional: true,
            elementType: "PROPERTY",
        });
        expect(parser.parseProperty("protected favouriteLetter = 'g'")).to.deep.equal({
            name: "favouriteLetter",
            type: {name: "UNKNOWN"},
            final: false,
            abstract: false,
            value: "'g'",
            defaultValue: "'g'",
            static: false,
            access: DiagramAccessModifier.PROTECTED,
            optional: false,
            elementType: "PROPERTY",
        });
    });
    it("Parse basic text", () => {
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
    });
});
