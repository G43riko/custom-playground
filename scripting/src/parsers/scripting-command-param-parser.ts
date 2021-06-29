import {ScriptingCommandParamParserSubResult} from "./scripting-command-param-parser-sub-result";

export interface ScriptingCommandParamParser<T> {
    parse(value: string): ScriptingCommandParamParserSubResult<T> | null;
}
