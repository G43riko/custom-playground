/**
 * Is returned from {@link CommandParamParser.parse} method
 */
export interface ScriptingCommandParamParserSubResult<T> {
    readonly remains: string;
    readonly result: T;
}