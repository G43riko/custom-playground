"use strict";
exports.__esModule = true;
exports.testMethod = exports.commentRegexp = exports.regexps = exports.utils = exports.DOCS_TEST_KEY = void 0;
var g_shared_library_1 = require("g-shared-library");
var node_1 = require("gtools/node");
var path = require("path");
var file_test_1 = require("./file-test");
exports.DOCS_TEST_KEY = "TESTED_OBJ";
exports.utils = {
    tabs: function (count) {
        return "\t".repeat(count);
    },
    createDescribe: function (title, data, tabs) {
        if (tabs === void 0) {
            tabs = 1;
        }
        var text = Array.isArray(data) ? data.join(g_shared_library_1.currentEOL) : String(data);
        return [
            exports.utils.tabs(tabs - 1) + "describe(\"" + title + "\", () => {",
            "" + exports.utils.tabs(tabs) + text,
            exports.utils.tabs(tabs - 1) + "});"
        ].join(g_shared_library_1.currentEOL);
    }
};
exports.regexps = {
    startComment: "\\/\\*\\*",
    endComment: "\\*\\/",
    endLine: "(\\n|\\r)",
    anyChar: "(.|\\n|\\r)",
    operatorPattern: /(={1,2}>|typeof)/,
    nextJsDocOrEnd: "(@\\w|\\*\\/)",
    tsJsExtension: /\.([tj]s)$/
};
exports.commentRegexp = new RegExp("" + exports.regexps.startComment + exports.regexps.endLine + "+?(" + exports.regexps.anyChar + "+?)" + exports.regexps.endComment + exports.regexps.anyChar + "+?function +(\\w+)", "gi");
exports.testMethod = {
    getTestsFor: function (fullPath) {
        var fileContent = g_shared_library_1.FileHolder.readFileSync(fullPath);
        var fileTest = file_test_1.FileTest.create(fileContent);
        if (fileTest) {
            return fileTest.getTextContentForFile(fullPath);
        }
        throw new Error("Cannot create performance-tests for file " + fullPath);
    },
    generateTestForInto: function (fullPath, testFilePath) {
        if (testFilePath === void 0) {
            testFilePath = fullPath.replace(exports.regexps.tsJsExtension, function (_, extension) {
                return ".generated.spec." + extension;
            });
        }
        g_shared_library_1.FileHolder.writeFileSync(testFilePath, exports.testMethod.getTestsFor(fullPath));
    },
    generateForCurrentArgs: function () {
        var fullFilePaths = g_shared_library_1.ParsedArguments.createProcessArgs().globResolvedFilesSync;
        console.log(fullFilePaths);
        var generationStart = node_1.createStopWatch();
        fullFilePaths.forEach(function (filePath) {
            var fullFilePath = path.resolve(filePath);
            var fileStart = node_1.createStopWatch();
            exports.testMethod.generateTestForInto(fullFilePath);
            console.log("Generated performance-tests for " + fullFilePath + " in " + fileStart.getDiff());
        });
        console.log("Generated " + fullFilePaths.length + " files for " + generationStart.getDiff());
    }
};
