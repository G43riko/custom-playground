"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var g_shared_library_1 = require("g-shared-library");
var perf_test_holder_1 = require("./perf-test-holder");
var CliRunner = /** @class */ (function () {
    function CliRunner() {
    }

    CliRunner.start = function () {
        // @ts-ignore-next-line
        var fs = require("fs");
        // @ts-ignore-next-line
        var filePath = g_shared_library_1.ParsedArguments.createProcessArgs().firstResolvedFile;
        var fileContent = fs.readFileSync(filePath, {encoding: "utf8"});
        var testRunner = new perf_test_holder_1.PerfTestHolder(fileContent);
        testRunner.runAllTests();
    };
    return CliRunner;
}());
