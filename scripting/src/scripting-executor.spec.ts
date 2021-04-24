import "mocha";
import { CommandParamTypes } from "./command-param-types";
import { EchoExecutor } from "./executors/echo-executor";
import { WaitExecutor } from "./executors/wait-executor";
import { CommandNumberParser } from "./parsers/command-number-parser";
import { CommandPositionParser } from "./parsers/command-position-parser";
import { CommandStringParser } from "./parsers/command-string-parser";
import { CommandTimeParser } from "./parsers/command-time-parser";
import { ScriptingExecutor } from "./scripting-executor";
import { ScriptingParserDataHolder } from "./scripting-parser-data-holder";

describe("Test basic executor", () => {
    it("should test basic execution", async () => {
        const executor = ScriptingExecutor.fromRowData(
            [
                ["ECHO", "{s[]}", new EchoExecutor()],
                ["WAIT", "{t}", new WaitExecutor()],
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

        const result = await executor.executeSync(`
            ECHO Start
            WAIT 1 s
            ECHO Finish succeed
            ECHO "Exit with code 0"
        `);
    });
});
