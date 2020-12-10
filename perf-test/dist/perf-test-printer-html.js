"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PerfTestPrinterHtml = void 0;
var PerfTestPrinterHtml = /** @class */ (function () {
    function PerfTestPrinterHtml(parent) {
        this.parent = parent;
    }

    PerfTestPrinterHtml.prototype.printTestTitle = function (title) {
        var titleDivider = "=".repeat(title.length);
        var data = [
            titleDivider,
            title,
            titleDivider,
        ];
        this.parent.innerHTML += data.join("<br/>") + "<br/>";
    };
    PerfTestPrinterHtml.prototype.printAnalyzerResult = function (data) {
        var _this = this;
        data.tests.forEach(function (item) {
            _this.parent.innerHTML += "<br/>";
            _this.parent.innerHTML += item.title + " - " + " ".repeat(data.maxTitleLength - item.title.length) + item.count + " calls per second.";
            _this.parent.innerHTML += "<span style='color: green'> " + item.memory + " bytes of memory used</span><br/>";
            _this.parent.innerHTML += "#".repeat(Math.floor(item.percentageCount)) + "<br/>";
            _this.parent.innerHTML += "<span style='color:green'>" + "#".repeat(Math.floor(item.percentageMemory)) + "</span><br/><br/>";
        });
    };
    return PerfTestPrinterHtml;
}());
exports.PerfTestPrinterHtml = PerfTestPrinterHtml;
