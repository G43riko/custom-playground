import { CommandParamParserFinalResult } from "../parsers/command-param-parser";

export interface ScriptingCommandExecutor<R = void, S = void> {
    execute(_data: R): S | Promise<S>;

    executeRaw(data: (CommandParamParserFinalResult<R> | null)[] | null): S | Promise<S>;
}
