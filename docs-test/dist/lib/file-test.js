"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.FileTest = void 0;
var g_shared_library_1 = require("g-shared-library");
var function_test_1 = require("./function-test");
var utils_1 = require("./utils");
var FileTest = /** @class */ (function () {
    function FileTest(tests) {
        this.tests = tests;
    }

    FileTest.prototype.getTextContentForFile = function (absoluteFilePath, useEs, forceName) {
        if (useEs === void 0) {
            useEs = true;
        }
        var pathParts = absoluteFilePath.split("\\");
        var realFileName = pathParts[pathParts.length - 1];
        var realFileNameWithoutExtension = realFileName.replace(/\.\w+$/, "");
        var name = forceName || './' + realFileNameWithoutExtension;
        var esImports = [
            "import { expect } from 'chai'",
            "import 'mocha';",
            "import * as " + utils_1.DOCS_TEST_KEY + " from '" + name + "';",
        ];
        var cjsImports = [
            "const { expect } = require('chai')",
            "const " + utils_1.DOCS_TEST_KEY + " = require('" + name + "');"
        ];
        var imports = useEs ? esImports : cjsImports;
        return __spreadArrays(imports, [
            utils_1.utils.createDescribe(realFileNameWithoutExtension, this.tests.map(function (e) {
                return e.getTexts();
            })),
        ]).join(g_shared_library_1.currentEOL) + g_shared_library_1.currentEOL;
    };
    FileTest.create = function (fileContent) {
        var commentMath = fileContent.match(utils_1.commentRegexp); //(.|\n)*?function (\w+)
        if (!commentMath) {
            return null;
        }
        return new FileTest(commentMath.map(function_test_1.FunctionTest.create).filter(function (e) {
            return e;
        }));
    };
    return FileTest;
}());
exports.FileTest = FileTest;
