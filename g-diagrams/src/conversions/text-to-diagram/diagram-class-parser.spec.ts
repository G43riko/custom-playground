import "mocha";
import {expect} from "chai";
import {DiagramClassParser} from "./diagram-class-parser";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {DiagramEntityType} from "../../class/entity/diagram-entity-type";
import {DiagramElementType} from "../../class/common/diagram-element-type";
import {DiagramAccessModifier} from "../../class/common/diagram-access-modifier";
import {DiagramType} from "../../class/common/diagram-type";

describe("Test text to diagram parser", () => {
    it("Parse attributes", () => {
        const parser = new DiagramClassParser({
            prefixAccessorMap: {
                [DiagramAccessModifier.PRIVATE]: "_",
            },
        });

        expect(parser.parseProperty("name")).to.deep.equal({
            name: "name",
            type: DiagramType.Unknown,
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
            type: DiagramType.Number,
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
            type: DiagramType.Unknown,
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
            type: DiagramType.NumberArray,
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
            type: DiagramType.StringArray,
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
            type: DiagramType.String,
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
            type: DiagramType.String,
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
            type: DiagramType.String,
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
            type: DiagramType.Unknown,
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
    it("Parse methods", () => {
        const parser = new DiagramClassParser({
            prefixAccessorMap: {
                [DiagramAccessModifier.PRIVATE]: "_",
            },
        });

        expect(parser.parseMethod("toString()")).to.deep.equal({
            name: "toString",
            returnType: DiagramType.Unknown,
            final: false,
            abstract: false,
            static: false,
            access: DiagramAccessModifier.PUBLIC,
            parameters: undefined,
            elementType: DiagramElementType.METHOD,
        });

        expect(parser.parseMethod("public getName(): string")).to.deep.equal({
            name: "getName",
            returnType: DiagramType.String,
            final: false,
            abstract: false,
            static: false,
            access: DiagramAccessModifier.PUBLIC,
            parameters: undefined,
            elementType: DiagramElementType.METHOD,
        });

        expect(parser.parseMethod("protected setName(name: string): void")).to.deep.equal({
            name: "setName",
            returnType: DiagramType.Void,
            final: false,
            abstract: false,
            static: false,
            access: DiagramAccessModifier.PROTECTED,
            parameters: [
                {
                    defaultValue: undefined,
                    index: 0,
                    name: "name",
                    optional: false,
                    type: DiagramType.String,
                },
            ],
            elementType: DiagramElementType.METHOD,
        });
        expect(parser.parseMethod("private getNick(defaultNick?: string): string[]")).to.deep.equal({
            name: "getNick",
            returnType: DiagramType.StringArray,
            final: false,
            abstract: false,
            static: false,
            access: DiagramAccessModifier.PRIVATE,
            parameters: [
                {
                    defaultValue: undefined,
                    index: 0,
                    name: "defaultNick",
                    optional: true,
                    type: DiagramType.String,
                },
            ],
            elementType: DiagramElementType.METHOD,
        });

        expect(parser.parseMethod("private introduce(toConsole: string = 'yes'): string")).to.deep.equal({
            name: "introduce",
            returnType: DiagramType.String,
            final: false,
            abstract: false,
            static: false,
            access: DiagramAccessModifier.PRIVATE,
            parameters: [
                {
                    defaultValue: "'yes'",
                    index: 0,
                    name: "toConsole",
                    optional: true,
                    type: DiagramType.String,
                },
            ],
            elementType: DiagramElementType.METHOD,
        });

        expect(parser.parseMethod("public sum(valueA: number, valueB: number, valueC?: number): number")).to.deep.equal({
            name: "sum",
            returnType: DiagramType.Number,
            final: false,
            abstract: false,
            static: false,
            access: DiagramAccessModifier.PUBLIC,
            parameters: [
                {
                    defaultValue: undefined,
                    index: 0,
                    name: "valueA",
                    optional: false,
                    type: DiagramType.Number,
                },
                {
                    defaultValue: undefined,
                    index: 1,
                    name: "valueB",
                    optional: false,
                    type: DiagramType.Number,
                },
                {
                    defaultValue: undefined,
                    index: 2,
                    name: "valueC",
                    optional: true,
                    type: DiagramType.Number,
                },
            ],
            elementType: DiagramElementType.METHOD,
        });
    });
    it("Parse basic class", () => {
        const parser = new DiagramClassParser();
        const {type, bodyRows, name} = parser.parseEntityBasic("class Person {}");

        expect(type).to.be.equal(DiagramEntityType.CLASS);

        const factory = DiagramEntityFactory.createClass(name);
        parser.parseClassBody(bodyRows, factory);
        const parsedDiagram = factory.build();

        expect(parsedDiagram.elementType).to.be.equal(DiagramElementType.ENTITY);
        expect(parsedDiagram.name).to.be.equal("Person");
        expect(parsedDiagram.access).to.be.equal(DiagramAccessModifier.PUBLIC);
        expect(parsedDiagram.type).to.be.equal(DiagramEntityType.CLASS);
    });
});
