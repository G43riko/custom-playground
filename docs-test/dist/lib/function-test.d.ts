import { FunctionTestCase } from "./function-test-case";

export declare class FunctionTest {
    private readonly functionName;
    private readonly testData;

    constructor(functionName: string, testData: FunctionTestCase[]);

    static create(item: string): FunctionTest | null;

    getTexts(): string;
}
