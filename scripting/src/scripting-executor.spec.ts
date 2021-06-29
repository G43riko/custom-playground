import "mocha";
import {ScriptingParamType} from "./scripting-param-type";
import {EchoExecutor} from "./executors/echo-executor";
import {WaitExecutor} from "./executors/wait-executor";
import {CommandNumberParser} from "./parsers/types/command-number-parser";
import {CommandPositionParser} from "./parsers/types/command-position-parser";
import {CommandStringParser} from "./parsers/types/command-string-parser";
import {CommandTimeParser} from "./parsers/types/command-time-parser";
import {ScriptingExecutor} from "./scripting-executor";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";

describe("Test basic executor", () => {
    it("should test basic execution", async () => {
        const executor = ScriptingExecutor.fromRowData(
            [
                ["ECHO", "{s[]}", new EchoExecutor()],
                ["WAIT", "{t}", new WaitExecutor()],
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

        const result = await executor.executeSync(`
            ECHO Start
            WAIT 1 s
            ECHO Finish succeed
            ECHO "Exit with code 0"
        `);
    });
});
