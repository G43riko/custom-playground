export interface CommandParamParserResult<T> {
    readonly remains: string;
    readonly result: T;
}

export interface CommandParamParserFinalResult<T> {
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
     * parsed result values
     */
    readonly data: T;
}

export interface CommandParamParser<T> {
    parse(value: string): CommandParamParserResult<T> | null;
}
