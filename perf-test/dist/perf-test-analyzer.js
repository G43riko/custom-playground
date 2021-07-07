"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PerfTestAnalyzer = void 0;
var PerfTestAnalyzer = /** @class */ (function () {
    function PerfTestAnalyzer() {
    }
    PerfTestAnalyzer.prototype.analyzeTestResults = function (data) {
        var fastestTestIterations = Math.max.apply(Math, data.testsData.map(function (d) {
            return d.count;
        }));
        var maxMemoryUsage = data.options.testMemory ? Math.max.apply(Math, data.testsData.map(function (d) {
            var _a;
            return (_a = d.memory) !== null && _a !== void 0 ? _a : 0;
        })) : 0;
        return {
            fastestTestIterations: fastestTestIterations,
            maxMemoryUsage: maxMemoryUsage,
            maxTitleLength: Math.max.apply(Math, data.testsData.map(function (d) {
                return d.test.title.length;
            })),
            tests: data.testsData.map(function (testData) {
                var _a;
                return ({
                    title: testData.test.title,
                    count: testData.count,
                    memory: testData.memory,
                    percentageCount: testData.count / fastestTestIterations * 100,
                    percentageMemory: data.options.testMemory ? (((_a = testData.memory) !== null && _a !== void 0 ? _a : 0) / maxMemoryUsage * 100) : undefined,
                    formattedTitle: testData.test.title,
                });
            }),
            duration: data.duration,
        };
    };
    return PerfTestAnalyzer;
}());
exports.PerfTestAnalyzer = PerfTestAnalyzer;
