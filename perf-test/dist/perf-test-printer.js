"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PerfTestPrinter = void 0;
var g_shared_library_1 = require("g-shared-library");
var PerfTestPrinter = /** @class */ (function () {
    function PerfTestPrinter() {
    }

    PerfTestPrinter.prototype.printTestTitle = function (title) {
        var titleDivider = "=".repeat(title.length);
        var data = [
            titleDivider,
            title,
            titleDivider,
        ];
        console.log(data.join(g_shared_library_1.currentEOL));
    };
    PerfTestPrinter.prototype.printAnalyzerResult = function (data) {
        data.tests.forEach(function (item) {
            console.log(item.title + " - " + " ".repeat(data.maxTitleLength - item.title.length) + item.count + " calls per second");
            console.log("#".repeat(Math.floor(item.percentageCount)));
            console.log("%c #".repeat(Math.floor(item.percentageMemory)), "color: red");
        });
    };
    return PerfTestPrinter;
}());
exports.PerfTestPrinter = PerfTestPrinter;
