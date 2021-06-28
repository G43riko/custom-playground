import {CommandParamParserFinalResult} from "./parsers/command-param-parser";

export interface ScriptingCommandValidator {
    /**
     * @returns true if data provided as parameter is valid
     */
    validate(data: (CommandParamParserFinalResult<unknown> | null)[]): Promise<{ message: string }[] | null>;
}
