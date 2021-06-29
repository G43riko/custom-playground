import {currentEOL} from "g-shared-library";
import {FunctionTestCase} from "./function-test-case";
import {regexps, utils} from "./utils";

export class FunctionTest {
    public constructor(
        private readonly functionName: string,
        private readonly testData: FunctionTestCase[],
    ) {
    }

    public static create(item: string): FunctionTest | null {
        const testCases = item.match(new RegExp(`@example(${regexps.anyChar}+?)${regexps.nextJsDocOrEnd}+?`));
        const splitByFunction = item.match(/function +(\w+)/);

        if (!splitByFunction || !testCases) {
            console.log("There is no examples or function is missing");

            return null;
        }
        const functionName = splitByFunction[1];

        const tests = Array.from(testCases[1].split(/[\n\r]/g)).map((rawLine) => FunctionTestCase.create(rawLine)).filter((holder) => holder) as FunctionTestCase[];

        return new FunctionTest(functionName, tests);
    }

    public getTexts(): string {
        return [
            `${utils.tabs(1)}it("It should test function ${this.functionName}", () => {`,
            `${this.testData.map((holder) => `${utils.tabs(2)}${holder.getTests()}`).join(currentEOL)}`,
            `${utils.tabs(1)}});`,
        ].join(currentEOL);
    }
}
