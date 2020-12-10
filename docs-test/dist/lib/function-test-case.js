"use strict";
exports.__esModule = true;
exports.FunctionTestCase = void 0;
var operator_1 = require("./operator");
var utils_1 = require("./utils");
var FunctionTestCase = /** @class */ (function () {
    function FunctionTestCase(condition, operator, result) {
        this.condition = condition;
        this.operator = operator;
        this.result = result;
    }

    FunctionTestCase.prototype.getTests = function () {
        return "expect(" + utils_1.DOCS_TEST_KEY + "." + this.condition + ")." + this.stringifyCondition(this.operator, this.result) + ";";
    };
    FunctionTestCase.prototype.stringifyCondition = function (operator, resultValue) {
        if (typeof resultValue === "boolean") {
            return "to.be." + resultValue;
        }
        if (typeof resultValue === "undefined") {
            return "to.be.undefined";
        }
        if (resultValue === null) {
            return "to.be.null";
        }
        return operator_1.stringifyOperator(operator) + "(" + this.stringifyResultValue(resultValue) + ")";
    };
    FunctionTestCase.prototype.stringifyResultValue = function (value) {
        if (typeof value === "number") {
            return value;
        }
        if (Array.isArray(value)) {
            return "[" + value.map((this.stringifyResultValue)).join(", ") + "]";
        }
        return "\"" + value + "\"";
    };
    FunctionTestCase.parseResultValue = function (value) {
        var replacedValue = value ? value.replace(/[;]/g, "").trim() : value;
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
        var parsedValue = Number(replacedValue);
        if (!isNaN(parsedValue)) {
            return parsedValue;
        }
        if (replacedValue.indexOf("[") === 0 && replacedValue.lastIndexOf("]") === replacedValue.length - 1) {
            var arrayItems = replacedValue.substring(1, replacedValue.length - 1).split(", ");
            return arrayItems.map(FunctionTestCase.parseResultValue);
        }
        return replacedValue;
    };
    FunctionTestCase.create = function (rawLine) {
        if (!rawLine) {
            return null;
        }
        var rawTestCase = rawLine.replace(/^\W*\\*\W*/, "");
        var operatorMath = rawTestCase.match(utils_1.regexps.operatorPattern);
        if (!rawTestCase || !operatorMath) {
            return null;
        }
        var operator = operator_1.parseOperator(operatorMath[0]);
        var condition = rawTestCase.substring(0, operatorMath.index).replace(/[;]/g, "").trim();
        var resultValue = FunctionTestCase.parseResultValue(rawTestCase.substring(operatorMath.index + operator.length));
        return new FunctionTestCase(condition, operator, resultValue);
    };
    return FunctionTestCase;
}());
exports.FunctionTestCase = FunctionTestCase;
