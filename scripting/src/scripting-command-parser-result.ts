import {ScriptingCommandParamParserResult} from "./parsers/scripting-command-param-parser-result";
import {ScriptingValidatorResult} from "./scripting-validator-result";

export interface ScriptingCommandParserResult {
    /**
     * Raw command etc. 'ECHO Gabriel'
     * is temporary, only for debugging
     */
    readonly raw: string;

    /**
     * Parsed parameter results or null if parameter cannot be parsed.
     * This property is send to {@link ScriptingCommandExecutor.executeRaw}
     */
    readonly data: (ScriptingCommandParamParserResult<unknown> | null)[] | null;

    /**
     * Trimmed name of command
     */
    readonly command: string;

    /**
     * List of validation errors
     */
    readonly validationErrors?: ScriptingValidatorResult;
}
