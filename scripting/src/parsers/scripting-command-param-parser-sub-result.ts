/**
 * Is returned from {@link ScriptingCommandParamParser.parse} method
 */
export interface ScriptingCommandParamParserSubResult<T> {
    readonly remains: string;
    readonly result: T;
}
