"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var perf_test_holder_1 = require("./perf-test-holder");
var perf_test_printer_html_1 = require("./perf-test-printer-html");
var BrowserRunner = /** @class */ (function () {
    function BrowserRunner() {
    }

    BrowserRunner.start = function () {
        var tester = new BrowserRunner();
        tester.appendTo("body");
    };
    BrowserRunner.prototype.appendTo = function (target, parent) {
        var _this = this;
        if (parent === void 0) {
            parent = document;
        }
        var targetElement = (typeof target === "string" ? parent.querySelector(target) : target);
        targetElement.innerHTML = "";
        var inputArea = parent.createElement("textarea");
        inputArea.placeholder = "Place your tests here. \nExample:\n\n/*\ntitle: Array spread operator vs Object.assign\n*/\n////////// Spread\nconst a = [\"a\", \"b\", \"c\"];\nconst b = [...a];\n////////// Assign\nconst a = [\"a\", \"b\", \"c\"];\nconst b = Object.assign([], a);\n";
        inputArea.cols = 100;
        inputArea.rows = 20;
        inputArea.value = "/*\ntitle: Array spread operator vs Object.assign\n*/\n////////// Spread\nconst a = [\"a\", \"b\", \"c\"];\nconst b = [...a];\n////////// Assign\nconst a = [\"a\", \"b\", \"c\"];\nconst b = Object.assign([], a);\n////////// Concat\nconst a = [\"a\", \"b\", \"c\"];\nconst b = [].concat(a);";
        var outputWrapper = parent.createElement("div");
        var processButton = parent.createElement("button");
        processButton.innerText = "process";
        processButton.onclick = function () {
            return _this.onChange(inputArea.value, outputWrapper);
        };
        targetElement.append(processButton);
        targetElement.append(inputArea);
        targetElement.append(outputWrapper);
    };
    BrowserRunner.prototype.onChange = function (testContent, outputWrapper) {
        var tests = new perf_test_holder_1.PerfTestHolder(testContent, new perf_test_printer_html_1.PerfTestPrinterHtml(outputWrapper));
        tests.runAllTests();
    };
    return BrowserRunner;
}());
