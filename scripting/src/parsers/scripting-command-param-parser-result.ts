import {ScriptingValidatorResult} from "../scripting-validator-result";

export interface ScriptingCommandParamParserResult<T> {
    /**
     * Parsed result type
     */
    readonly type: {
        /**
         * Type name etc. STRING, NUMBER
         */
        readonly type: string;

        /**
         * true if type value is array
         */
        readonly array: boolean;
    };
    /**
     * Raw, not parsed parameter
     */
    readonly rawData: string;

    /**
     * parsed result values. Is value from {@link ScriptingCommandParamParserSubResult.result}
     */
    readonly data: T;

    readonly validationErrors?: ScriptingValidatorResult;
}
