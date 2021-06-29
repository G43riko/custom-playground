import {expect} from "chai";
import "mocha";
import {ScriptingParamType} from "./scripting-param-type";
import {CommandNumberParser} from "./parsers/types/command-number-parser";
import {CommandPositionParser} from "./parsers/types/command-position-parser";
import {CommandStringParser} from "./parsers/types/command-string-parser";
import {CommandTimeParser} from "./parsers/types/command-time-parser";
import {ScriptingParser} from "./scripting-parser";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";
import {ScriptingCommandParamParserResult} from "./parsers/scripting-command-param-parser-result";
import {ScriptingCommandParamValidator} from "./scripting-command-param-validator";

describe("Test basic validator", () => {
    it("should test custom parser", () => {
        const testParser = new ScriptingParser(
            [
                {
                    name: "TEST",
                    pattern: "TEST {s} {s[]}",
                },
            ],
            ScriptingParserDataProvider.fromFlatArray([
                [new CommandStringParser(), ScriptingParamType.STRING, "s"],
            ]),
        );

        expect(testParser.parse("TEST gabo je vysoky")).to.deep.equal([
            {
                command: "TEST",
                data: [
                    {
                        data: "gabo",
                        rawData: "gabo",
                        type: {
                            array: false,
                            type: "STRING",
                        },
                    },
                    {
                        data: [
                            "je",
                            "vysoky",
                        ],
                        rawData: "je vysoky",
                        type: {
                            array: true,
                            type: "STRING",
                        },
                    },
                ],
                raw: "TEST gabo je vysoky",
            },
        ]);
    });

    it("should test custom parameter validation", async () => {
        const testParser = new ScriptingParser(
            [
                {
                    name: "TEST",
                    pattern: "TEST {s} {s[]}",
                },
                {
                    name: "SUM",
                    pattern: "SUM {d} {d}",
                },
                {
                    name: "SUM2",
                    pattern: "SUM2 {d[]}",
                },
            ],
            ScriptingParserDataProvider.fromFlatArray([
                [new CommandStringParser(), ScriptingParamType.STRING, "s"],
                [new CommandNumberParser(true), ScriptingParamType.INT_P, "d", ScriptingCommandParamValidator.min(0)],
            ]),
        );

        expect(testParser.parse("SUM 1 2")).to.deep.equal([
            {
                command: "SUM",
                data: [
                    {
                        data: 1,
                        rawData: "1",
                        type: {
                            array: false,
                            type: "INT_P",
                        },
                    },
                    {
                        data: 2,
                        rawData: "2",
                        type: {
                            array: false,
                            type: "INT_P",
                        },
                    },
                ],
                raw: "SUM 1 2",
            },
        ]);
        expect(await testParser.parseAndValidate("SUM 1 2")).to.deep.equal([
            {
                command: "SUM",
                data: [
                    {
                        data: 1,
                        rawData: "1",
                        type: {
                            array: false,
                            type: "INT_P",
                        },
                        validationErrors: null,
                    },
                    {
                        data: 2,
                        rawData: "2",
                        type: {
                            array: false,
                            type: "INT_P",
                        },
                        validationErrors: null,
                    },
                ],
                validationErrors: null,
                raw: "SUM 1 2",
            },
        ]);
        expect(await testParser.parseAndValidate("SUM 1 -2")).to.deep.equal([
            {
                command: "SUM",
                data: [
                    {
                        data: 1,
                        rawData: "1",
                        type: {
                            array: false,
                            type: "INT_P",
                        },
                        validationErrors: null,
                    },
                    {
                        data: -2,
                        rawData: "-2",
                        type: {
                            array: false,
                            type: "INT_P",
                        },
                        validationErrors: [
                            {
                                message: "Value -2 is lower then minimal value 0",
                            },
                        ],
                    },
                ],
                validationErrors: null,
                raw: "SUM 1 -2",
            },
        ]);
    });

    it("should test custom array parser", () => {
        const testParser = new ScriptingParser(
            [
                {
                    name: "TEST",
                    pattern: "TEST {s[]}",
                },
            ],
            ScriptingParserDataProvider.fromFlatArray([
                [new CommandStringParser(), ScriptingParamType.STRING, "s"],
            ]),
        );

        expect(testParser.parse("TEST gabo je vysoky")).to.deep.equal([
            {
                command: "TEST",
                data: [
                    {
                        data: [
                            "gabo",
                            "je",
                            "vysoky",
                        ],
                        rawData: "gabo je vysoky",
                        type: {
                            array: true,
                            type: "STRING",
                        },
                    },
                ],
                raw: "TEST gabo je vysoky",
            },
        ]);
    });
    it("should test validators", async () => {
        const testParser = new ScriptingParser(
            [
                {
                    name: "TEST",
                    pattern: "TEST {s[]}",
                    validator: {
                        async validate(data: (ScriptingCommandParamParserResult<unknown> | null)[]): Promise<{ message: string }[] | null> {
                            if ((data[0]?.data as any).length === 3) {
                                return null;
                            }

                            return [
                                {
                                    message: "Array must have 3 elements",
                                },
                            ];
                        },
                    },
                },
            ],
            ScriptingParserDataProvider.fromFlatArray([
                [new CommandStringParser(), ScriptingParamType.STRING, "s"],
            ]),
        );

        expect(await testParser.parseAndValidate("TEST gabo je vysoky")).to.deep.equal([
            {
                command: "TEST",
                data: [
                    {
                        data: [
                            "gabo",
                            "je",
                            "vysoky",
                        ],
                        rawData: "gabo je vysoky",
                        type: {
                            array: true,
                            type: "STRING",
                        },
                    },
                ],
                validationErrors: null,
                raw: "TEST gabo je vysoky",
            },
        ]);
        expect(await testParser.parseAndValidate("TEST gabo je fakt vysoky")).to.deep.equal([
            {
                command: "TEST",
                data: [
                    {
                        data: [
                            "gabo",
                            "je",
                            "fakt",
                            "vysoky",
                        ],
                        rawData: "gabo je fakt vysoky",
                        type: {
                            array: true,
                            type: "STRING",
                        },
                    },
                ],
                validationErrors: [
                    {
                        message: "Array must have 3 elements",
                    },
                ],
                raw: "TEST gabo je fakt vysoky",
            },
        ]);
    });
    it("should test basic validation", () => {
        const parser = ScriptingParser.fromPatterns(
            [
                ["ECHO", "{s[]}"],
                ["WAIT", "{t}"],
                ["MOVE", "{p2} {s[]}"],
            ],
            ScriptingParserDataProvider.fromFlatArray([
                [new CommandTimeParser(), ScriptingParamType.TIME, "t"],
                [new CommandStringParser(), ScriptingParamType.STRING, "s"],
                [new CommandNumberParser(), ScriptingParamType.NUMBER, "n"],
                [new CommandNumberParser(), ScriptingParamType.FLOAT, "f"],
                [new CommandNumberParser(true), ScriptingParamType.INT, "i"],
                [new CommandPositionParser(2), ScriptingParamType.POSITION2, "p2"],
                [new CommandPositionParser(3), ScriptingParamType.POSITION3, "p3"],
                [new CommandPositionParser(2, "RELATIVE"), ScriptingParamType.POSITION_RELATIVE2, "r2"],
                [new CommandPositionParser(3, "RELATIVE"), ScriptingParamType.POSITION_RELATIVE3, "r3"],
                [new CommandPositionParser(2, "ABSOLUTE"), ScriptingParamType.POSITION_ABSOLUTE2, "a2"],
                [new CommandPositionParser(3, "ABSOLUTE"), ScriptingParamType.POSITION_ABSOLUTE3, "a3"],
            ]),
        );

        const result = parser.parse(`
            ECHO Starting
            WAIT 10 ms
            MOVE 5 10 gabo
            MOVE _5 10 gabo
        `);

        result.forEach(({raw, data}) => console.log(`'${raw}' was parsed to ${JSON.stringify(data)}`));

    });
});
