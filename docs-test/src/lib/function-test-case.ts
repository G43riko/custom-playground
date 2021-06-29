import {Operator, operatorToString, parseOperator} from "./operator";
import {DOCS_TEST_KEY, regexps} from "./utils";

export class FunctionTestCase<T = unknown> {
    private constructor(
        private readonly condition: string,
        private readonly operator: Operator,
        private readonly result: T,
    ) {
    }

    public static create<T>(rawLine: string): FunctionTestCase<T> | null {
        if (!rawLine) {
            console.warn("Cannot create test case from empty line");

            return null;
        }
        const rawTestCase = rawLine.replace(/^\W*\\*\W*/, "");
        const operatorMath = rawTestCase.match(regexps.operatorPattern);

        if (!rawTestCase || !operatorMath) {
            console.warn("Test case is missing or operator is not in correct format");

            return null;
        }
        const operator = parseOperator(operatorMath[0]);
        const condition = rawTestCase.substring(0, operatorMath.index).replace(/[;]/g, "").trim();
        const resultValue = FunctionTestCase.parseResultValue(rawTestCase.substring(operatorMath.index! + operator.length));

        return new FunctionTestCase(condition, operator, resultValue as T);
    }

    private static parseResultValue(value: string): unknown {
        const correctedValue = value ? value.replace(/[;]/g, "").trim() : value;

        // check boolean values
        if (correctedValue === "true") {
            return true;
        }
        if (correctedValue === "false") {
            return false;
        }

        // check string surrounded with "
        if (correctedValue.indexOf("\"") === 0 && correctedValue.lastIndexOf("\"") === correctedValue.length - 1) {
            return correctedValue.substring(1, correctedValue.length - 1);
        }

        // check special javascript types
        if (correctedValue === "undefined") {
            return undefined;
        }
        if (correctedValue === "null") {
            return null;
        }

        const parsedValue = Number(correctedValue);
        if (!isNaN(parsedValue)) {
            return parsedValue;
        }

        if (correctedValue.indexOf("{}") === 0) {
            return {};
        }
        if (correctedValue.indexOf("[]") === 0) {
            return [];
        }
        if (correctedValue.indexOf("{") === 0 && correctedValue.lastIndexOf("}") === correctedValue.length - 1) {
            return eval(`(${correctedValue})`);
        }
        if (correctedValue.indexOf("[") === 0 && correctedValue.lastIndexOf("]") === correctedValue.length - 1) {
            const arrayItems = correctedValue.substring(1, correctedValue.length - 1).split(",");

            return arrayItems.map(FunctionTestCase.parseResultValue);
        }

        return correctedValue;
    }

    public getTests(): string {
        return `expect(${DOCS_TEST_KEY}.${this.condition}).${this.stringifyCondition(this.operator, this.result)};`;
    }

    private stringifyCondition(operator: Operator, resultValue: unknown): string {
        if (typeof resultValue === "boolean") {
            return `to.be.${resultValue}`;
        }
        if (typeof resultValue === "undefined") {
            return "to.be.undefined";
        }
        if (resultValue === null) {
            return "to.be.null";
        }

        return `${operatorToString(operator)}(${this.stringifyResultValue(resultValue)})`;
    }

    private stringifyResultValue(value: unknown): unknown {
        if (typeof value === "number") {
            return value;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                return `[${value.map((this.stringifyResultValue)).join(", ")}]`;
            }

            return JSON.stringify(value);
        }

        return `"${value}"`;
    }
}
