"use strict";
exports.__esModule = true;
exports.FunctionTest = void 0;
var g_shared_library_1 = require("g-shared-library");
var function_test_case_1 = require("./function-test-case");
var utils_1 = require("./utils");
var FunctionTest = /** @class */ (function () {
    function FunctionTest(functionName, testData) {
        this.functionName = functionName;
        this.testData = testData;
    }

    FunctionTest.prototype.getTexts = function () {
        return [
            utils_1.utils.tabs(1) + "it(\"It should test function " + this.functionName + "\", () => {",
            "" + this.testData.map(function (holder) {
                return "" + utils_1.utils.tabs(2) + holder.getTests();
            }).join(g_shared_library_1.currentEOL),
            utils_1.utils.tabs(1) + "});"
        ].join(g_shared_library_1.currentEOL);
    };
    FunctionTest.create = function (item) {
        var testCases = item.match(new RegExp("@example(" + utils_1.regexps.anyChar + "+?)" + utils_1.regexps.nextJsDocOrEnd + "+?"));
        var splitByFunction = item.match(/function +(\w+)/);
        if (!splitByFunction || !testCases) {
            return null;
        }
        var functionName = splitByFunction[1];
        var tests = Array.from(testCases[1].split(/[\n\r]/g)).map(function (rawLine) {
            return function_test_case_1.FunctionTestCase.create(rawLine);
        }).filter(function (holder) {
            return holder;
        });
        return new FunctionTest(functionName, tests);
    };
    return FunctionTest;
}());
exports.FunctionTest = FunctionTest;
