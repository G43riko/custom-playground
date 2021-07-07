"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true, get: function () {
            return m[k];
        }
    });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", {value: true});
__exportStar(require("./browser-runner"), exports);
__exportStar(require("./cli-runner"), exports);
__exportStar(require("./perf-test-analyzer"), exports);
__exportStar(require("./perf-test-holder"), exports);
__exportStar(require("./perf-test-parser"), exports);
__exportStar(require("./printers/perf-test-printer"), exports);
__exportStar(require("./printers/perf-test-printer-html"), exports);
__exportStar(require("./perf-test-runner"), exports);
__exportStar(require("./types/perf-test-analyzer-result"), exports);
__exportStar(require("./types/perf-test-result"), exports);
__exportStar(require("./types/perf-tests-result"), exports);
__exportStar(require("./types/perf-test"), exports);
// const tester = new BrowserRunner();
// tester.appendTo("body");
