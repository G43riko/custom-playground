export interface CommandParamParserResult<T> {
    readonly remains: string;
    readonly result: T;
}

export interface CommandParamParserFinalResult<T> {
    readonly type: {
        readonly type: string;
        readonly array: boolean;
    };
    readonly rawData: string;
    readonly data: T;
}

export interface CommandParamParser<T> {
    parse(value: string): CommandParamParserResult<T> | null;
}
