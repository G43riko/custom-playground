"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PerfTestRunner = void 0;
var PerfTestRunner = /** @class */ (function () {
    function PerfTestRunner() {
    }

    PerfTestRunner.prototype.getMemory = function () {
        var _a, _b;
        // @ts-ignore-next-line
        var performanceMemory = (_a = performance === null || performance === void 0 ? void 0 : performance.memory) === null || _a === void 0 ? void 0 : _a.usedJSHeapSize;
        if (performanceMemory) {
            return performanceMemory;
        }
        // @ts-ignore-next-line
        var processMemory = (_b = process === null || process === void 0 ? void 0 : process.memoryUsage()) === null || _b === void 0 ? void 0 : _b.heapUsed;
        if (processMemory) {
            return processMemory;
        }
        return 0;
    };
    PerfTestRunner.prototype.runTest = function (test) {
        var count = 0;
        var now = Date.now();
        var startMemory = this.getMemory();
        if (typeof exports.gc === "function") {
            exports.gc();
        }
        var finishTime = now + 1000;
        while (finishTime > Date.now()) {
            test.content();
            count++;
        }
        var duration = Date.now() - now;
        var memory = Math.max(this.getMemory() - startMemory, 0);
        return {count: count, duration: duration, test: test, memory: memory};
    };
    PerfTestRunner.prototype.runTests = function (tests) {
        var _this = this;
        var now = Date.now();
        var testsData = tests.map(function (test) {
            return _this.runTest(test);
        });
        var duration = Date.now() - now;
        return {duration: duration, testsData: testsData};
    };
    return PerfTestRunner;
}());
exports.PerfTestRunner = PerfTestRunner;
