import "mocha";
import { CommandParamTypes } from "./command-param-types";
import { CommandNumberParser } from "./parsers/command-number-parser";
import { CommandPositionParser } from "./parsers/command-position-parser";
import { CommandStringParser } from "./parsers/command-string-parser";
import { CommandTimeParser } from "./parsers/command-time-parser";
import { ScriptingParser } from "./scripting-parser";
import { ScriptingParserDataHolder } from "./scripting-parser-data-holder";

describe("Test basic validator", () => {
    it("should test basic validation", () => {
        const parser = ScriptingParser.fromPatterns(
            [
                ["ECHO", "{s[]}"],
                ["WAIT", "{t}"],
                ["MOVE", "{p2} {s[]}"],
            ],
            ScriptingParserDataHolder.fromFlatArray([
                [new CommandTimeParser(), CommandParamTypes.TIME, "t"],
                [new CommandStringParser(), CommandParamTypes.STRING, "s"],
                [new CommandNumberParser(), CommandParamTypes.NUMBER, "n"],
                [new CommandNumberParser(), CommandParamTypes.FLOAT, "f"],
                [new CommandNumberParser(true), CommandParamTypes.INT, "i"],
                [new CommandPositionParser(2), CommandParamTypes.POSITION2, "p2"],
                [new CommandPositionParser(3), CommandParamTypes.POSITION3, "p3"],
                [new CommandPositionParser(2, "RELATIVE"), CommandParamTypes.POSITION_RELATIVE2, "r2"],
                [new CommandPositionParser(3, "RELATIVE"), CommandParamTypes.POSITION_RELATIVE3, "r3"],
                [new CommandPositionParser(2, "ABSOLUTE"), CommandParamTypes.POSITION_ABSOLUTE2, "a2"],
                [new CommandPositionParser(3, "ABSOLUTE"), CommandParamTypes.POSITION_ABSOLUTE3, "a3"],
            ]),
        );

        const result = parser.parseContent(`
            ECHO Starting
            WAIT 10 ms
            MOVE 5 10 gabo
            MOVE _5 10 gabo
        `);

        result.forEach(({raw, data}) => console.log(`'${raw}' was parsed to ${JSON.stringify(data)}`));

    });
});
