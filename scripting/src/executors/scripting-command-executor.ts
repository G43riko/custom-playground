import {ScriptingCommandParamParserResult} from "../parsers/scripting-command-param-parser-result";

/**
 * @template R - Parameter type of {@link execute} function;
 * @template S - Result type of {@link execute} and {@link executeRaw} functions;
 */
export interface ScriptingCommandExecutor<R = void, S = void> {
    /**
     * Execute main action of executor
     *
     * @param data
     */
    execute(data: R): S | Promise<S>;

    /**
     * Should make additionally checks and calls {@link execute} method
     *
     * @param data - data property of {@link ScriptingCommandParserResult}
     */
    executeRaw(data: (ScriptingCommandParamParserResult<R> | null)[] | null): S | Promise<S>;
}
