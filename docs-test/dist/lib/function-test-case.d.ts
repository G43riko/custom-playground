export declare class FunctionTestCase<T = unknown> {
    private static parseResultValue;
    private readonly condition;
    private readonly operator;
    private readonly result;
    private stringifyCondition;
    private stringifyResultValue;

    private constructor();

    static create<T>(rawLine: string): FunctionTestCase<T> | null;

    getTests(): string;
}
