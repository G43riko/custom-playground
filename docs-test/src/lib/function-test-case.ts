import { Operator, parseOperator, stringifyOperator } from "./operator";
import { DOCS_TEST_KEY, regexps } from "./utils";

export class FunctionTestCase<T = unknown> {
    private constructor(private readonly condition: string,
                        private readonly operator: Operator,
                        private readonly result: T) {
    }

    public static create<T>(rawLine: string): FunctionTestCase<T> | null {
        if (!rawLine) {
            return null;
        }
        const rawTestCase  = rawLine.replace(/^\W*\\*\W*/, "");
        const operatorMath = rawTestCase.match(regexps.operatorPattern);

        if (!rawTestCase || !operatorMath) {
            return null;
        }
        const operator    = parseOperator(operatorMath[0]);
        const condition   = rawTestCase.substring(0, operatorMath.index).replace(/[;]/g, "").trim();
        const resultValue = FunctionTestCase.parseResultValue(rawTestCase.substring(operatorMath.index! + operator.length));

        return new FunctionTestCase(condition, operator, resultValue as T);
    }

    private static parseResultValue(value: string): unknown {
        const replacedValue = value ? value.replace(/[;]/g, "").trim() : value;

        if (replacedValue === "true") {
            return true;
        }
        if (replacedValue === "false") {
            return false;
        }

        if (replacedValue.indexOf("\"") === 0 && replacedValue.lastIndexOf("\"") === replacedValue.length - 1) {
            return replacedValue.substring(1, replacedValue.length - 1);
        }

        if (replacedValue === "undefined") {
            return undefined;
        }
        if (replacedValue === "null") {
            return null;
        }

        const parsedValue = Number(replacedValue);
        if (!isNaN(parsedValue)) {
            return parsedValue;
        }

        if (replacedValue.indexOf("{}") === 0) {
            return {};
        }
        if (replacedValue.indexOf("[]") === 0) {
            return [];
        }
        if (replacedValue.indexOf("{") === 0 && replacedValue.lastIndexOf("}") === replacedValue.length - 1) {
            return eval(`(${replacedValue})`);
        }
        if (replacedValue.indexOf("[") === 0 && replacedValue.lastIndexOf("]") === replacedValue.length - 1) {
            const arrayItems = replacedValue.substring(1, replacedValue.length - 1).split(",");

            return arrayItems.map(FunctionTestCase.parseResultValue);
        }

        return replacedValue;
    }

    public getTests(): string {
        return `expect(${DOCS_TEST_KEY}.${this.condition}).${this.stringifyCondition(this.operator, this.result)};`
    }

    private stringifyCondition(operator: Operator, resultValue: unknown) {
        if (typeof resultValue === "boolean") {
            return `to.be.${resultValue}`;
        }
        if (typeof resultValue === "undefined") {
            return "to.be.undefined";
        }
        if (resultValue === null) {
            return "to.be.null";
        }

        return `${stringifyOperator(operator)}(${this.stringifyResultValue(resultValue)})`;
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
