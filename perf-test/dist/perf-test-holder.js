"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PerfTestHolder = void 0;
var perf_test_analyzer_1 = require("./perf-test-analyzer");
var perf_test_parser_1 = require("./perf-test-parser");
var perf_test_printer_1 = require("./printers/perf-test-printer");
var perf_test_runner_1 = require("./perf-test-runner");
var PerfTestHolder = /** @class */ (function () {
    function PerfTestHolder(fileContent, options, printer) {
        if (options === void 0) {
            options = {};
        }
        if (printer === void 0) {
            printer = new perf_test_printer_1.PerfTestPrinter();
        }
        this.fileContent = fileContent;
        this.options = options;
        this.printer = printer;
        this.parser = new perf_test_parser_1.PerfTestParser(this.fileContent);
        this.runner = new perf_test_runner_1.PerfTestRunner(this.options);
        this.analyzer = new perf_test_analyzer_1.PerfTestAnalyzer();
    }

    PerfTestHolder.prototype.runAllTests = function () {
        this.printer.printTestTitle(this.parser.extractHeader("title"));
        var beforeAll = this.parser.extractHeader("beforeAll");
        var thisArg = this.parser.extractHeader("thisArg");
        var testResults = this.runner.runTests(this.parser.data, thisArg);
        var testAnalyzeResults = this.analyzer.analyzeTestResults(testResults);
        this.printer.printAnalyzerResult(testAnalyzeResults);
    };
    return PerfTestHolder;
}());
exports.PerfTestHolder = PerfTestHolder;
