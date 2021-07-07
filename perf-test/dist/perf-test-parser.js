"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PerfTestParser = void 0;
var testDivider = /\/{9}/gim;
var headerSelector = "((: ?```((.|\n|\r)+)```)|(: ?(.+)[\n\r]{1,2}))";
var PerfTestParser = /** @class */ (function () {
    function PerfTestParser(fileContent) {
        var _a = fileContent.split(testDivider), header = _a[0], testContents = _a.slice(1);
        this.header = header;
        this.data = this.processTestContents(testContents);
    }
    PerfTestParser.prototype.extractHeader = function (key) {
        var result = this.header.match(new RegExp(key + headerSelector, "i"));
        return this.getLastMatch(result);
    };
    PerfTestParser.prototype.getLastMatch = function (match) {
        var _a;
        if (!match) {
            return "";
        }
        for (var i = match.length - 1; i >= 0; i--) {
            if ((_a = match[i]) === null || _a === void 0 ? void 0 : _a.trim()) {
                return match[i];
            }
        }
        return "";
    };
    PerfTestParser.prototype.processTestContents = function (testContents) {
        return testContents.map(function (content) {
            var result = content.match(/\/ ?(.+)[\n\r]+((.|\n|\r)+)/i);
            if (!result) {
                return null;
            }
            return {
                title: result[1],
                content: new Function(result[2]),
                header: "____" + Math.random(),
            };
        }).filter(function (e) {
            return e;
        });
    };
    return PerfTestParser;
}());
exports.PerfTestParser = PerfTestParser;
