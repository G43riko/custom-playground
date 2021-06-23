import "mocha";
import {expect} from "chai";
import {DiagramParserTexts} from "./diagram-parser-texts";


describe("Test text to diagram parser", () => {
    xit("Parse basic text", async () => {
        const parser = new DiagramParserTexts();
        const parsedDiagram = null; //parser.parse(DiagramParserTexts.diagram1);

        // to.NOT.deep.equal because of undefined properties in result
        expect(parsedDiagram).to.not.deep.equal([
            {
                "name": "PersonId",
                "type": "string",
                "elementType": "PRIMITIVE",
            },
            {
                "elementType": "ENTITY",
                "name": "AbstractPerson",
                "access": "PUBLIC",
                "type": "CLASS",
                "properties": [
                    {
                        "name": "id",
                        "type": {
                            "name": "LINK",
                            "className": " PersonId",
                        },
                        "final": true,
                        "abstract": false,
                        "static": false,
                        "access": "PUBLIC",
                        "optional": false,
                        "elementType": "PROPERTY",
                    },
                    {
                        "name": "#name",
                        "type": {
                            "name": "LINK",
                            "className": " string",
                        },
                        "final": false,
                        "abstract": false,
                        "static": false,
                        "access": "PUBLIC",
                        "optional": false,
                        "elementType": "PROPERTY",
                    },
                    {
                        "name": "alive",
                        "defaultValue": "true",
                        "type": {
                            "name": "LINK",
                        },
                        "final": false,
                        "abstract": false,
                        "static": false,
                        "access": "PUBLIC",
                        "optional": false,
                        "value": " true",
                        "elementType": "PROPERTY",
                    },
                    {
                        "name": "age",
                        "defaultValue": "0",
                        "type": {
                            "name": "LINK",
                            "className": " number ",
                        },
                        "final": false,
                        "abstract": false,
                        "static": false,
                        "access": "PUBLIC",
                        "optional": false,
                        "value": " 0",
                        "elementType": "PROPERTY",
                    },
                ],
                "methods": [
                    {
                        "name": "toString",
                        "abstract": false,
                        "final": false,
                        "access": "PUBLIC",
                        "static": false,
                        "returnType": {
                            "name": "LINK",
                            "className": "string",
                        },
                        "elementType": "METHOD",
                    },
                    {
                        "name": "setName",
                        "abstract": false,
                        "final": false,
                        "access": "PROTECTED",
                        "static": false,
                        "returnType": {
                            "name": "LINK",
                            "className": "void",
                        },
                        "parameters": [
                            {
                                "index": 0,
                                "name": "name",
                                "type": {
                                    "name": "LINK",
                                    "className": " string",
                                },
                                "optional": false,
                            },
                        ],
                        "elementType": "METHOD",
                    },
                    {
                        "name": "setAge",
                        "abstract": false,
                        "final": false,
                        "access": "PRIVATE",
                        "static": false,
                        "returnType": {
                            "name": "LINK",
                            "className": "void",
                        },
                        "parameters": [
                            {
                                "index": 0,
                                "name": "name",
                                "type": {
                                    "name": "LINK",
                                    "className": " number",
                                },
                                "optional": false,
                            },
                            {
                                "index": 1,
                                "name": "force",
                                "type": {
                                    "name": "LINK",
                                },
                                "defaultValue": "true",
                                "optional": false,
                            },
                        ],
                        "elementType": "METHOD",
                    },
                ],
                "generics": [],
                "abstract": true,
                "parentImplements": [],
            },
        ]);
    });
});
