"use strict";
exports.__esModule = true;
exports.stringifyOperator = exports.parseOperator = exports.Operator = void 0;
var Operator;
(function (Operator) {
    Operator["TYPEOF"] = "typeof";
    Operator["EQUAL"] = "=>";
    Operator["DEEP_EQUAL"] = "==>";
})(Operator = exports.Operator || (exports.Operator = {}));

function parseOperator(operator) {
    switch (operator) {
        case Operator.DEEP_EQUAL:
            return Operator.DEEP_EQUAL;
        case Operator.EQUAL:
            return Operator.EQUAL;
        case Operator.TYPEOF:
            return Operator.TYPEOF;
        default:
            throw new Error("Unknown operator " + operator);
    }
}

exports.parseOperator = parseOperator;

function stringifyOperator(operator) {
    switch (operator) {
        case Operator.DEEP_EQUAL:
            return "to.deep.equal";
        case Operator.EQUAL:
            return "to.be.equal";
        case Operator.TYPEOF:
            return "to.be.an";
        default:
            throw new Error("Unknown operator " + operator);
    }
}

exports.stringifyOperator = stringifyOperator;
