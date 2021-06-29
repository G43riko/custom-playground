import {ScriptingCommandParamParserResult} from "./parsers/scripting-command-param-parser-result";

export interface ScriptingCommandValidator {
    /**
     * @returns true if data provided as parameter is valid
     */
    validate(data: (ScriptingCommandParamParserResult<unknown> | null)[]): Promise<{ message: string }[] | null>;

}
