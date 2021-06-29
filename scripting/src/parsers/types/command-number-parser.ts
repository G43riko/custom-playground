import {ScriptingCommandParamParser} from "../scripting-command-param-parser";
import {ScriptingCommandParamParserSubResult} from "../scripting-command-param-parser-sub-result";

export class CommandNumberParser implements ScriptingCommandParamParser<number> {
    public constructor(private readonly isInteger = false) {
    }

    public parse(value: string): ScriptingCommandParamParserSubResult<number> | null {
        if (!this.isInteger) {
            return this.parseLocally(value);
        }
        const parsedData = this.parseLocally(value);
        if (!parsedData || parsedData.result % 1 !== 0) {
            return null;
        }

        return parsedData;
    }

    private parseLocally(value: string): ScriptingCommandParamParserSubResult<number> | null {
        const result = parseFloat(value);

        if (isNaN(result)) {
            return null;
        }

        return {
            result,
            remains: value.split(String(result))[1],
        };
    }
}
