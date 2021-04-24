import "mocha";
import { CommandParamTypes } from "./command-param-types";
import { CommandNumberParser } from "./parsers/command-number-parser";
import { CommandStringParser } from "./parsers/command-string-parser";
import { CommandTimeParser } from "./parsers/command-time-parser";
import { ScriptingParser } from "./scripting-parser";
import { ScriptingParserDataHolder } from "./scripting-parser-data-holder";

describe("Test basic validator", () => {
    it("should test basic validation", () => {
        const parser = ScriptingParser.fromPatterns(
            [
                "ECHO {s[]}",
                "ECHOA {n} {s[]} ",
                "ECHOB {n[]} {s[]} ",
                "WAIT {t}",
                "MOVE {a2} {s[]}",
            ],
            ScriptingParserDataHolder.fromFlatArray([
                [new CommandTimeParser(), CommandParamTypes.TIME, "t"],
                [new CommandStringParser(), CommandParamTypes.STRING, "s"],
                [new CommandNumberParser(), CommandParamTypes.FLOAT, "f"],
                [new CommandNumberParser(), CommandParamTypes.NUMBER, "n"],
                [new CommandNumberParser(true), CommandParamTypes.INT, "i"],
            ]),
        );

        parser.parseContent(`
            ECHO Nazdar
            ECHO "Nazdar gabrielito" ako "sa mas"
            ECHO ako sa mas
            ECHOA 21 ako sa mas
            ECHOB 21 22 sa mas
            WAIT 10 ms
        `);
    });
});
