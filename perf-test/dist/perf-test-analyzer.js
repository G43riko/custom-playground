"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PerfTestAnalyzer = void 0;
var PerfTestAnalyzer = /** @class */ (function () {
    function PerfTestAnalyzer() {
    }

    PerfTestAnalyzer.prototype.analyzeTestResults = function (data) {
        var fastestsTestIterations = Math.max.apply(Math, data.testsData.map(function (d) {
            return d.count;
        }));
        var maxMemoryUsage = Math.max.apply(Math, data.testsData.map(function (d) {
            return d.memory;
        }));
        return {
            fastestsTestIterations: fastestsTestIterations,
            maxMemoryUsage: maxMemoryUsage,
            maxTitleLength: Math.max.apply(Math, data.testsData.map(function (d) {
                return d.test.title.length;
            })),
            tests: data.testsData.map(function (testData) {
                return ({
                    title: testData.test.title,
                    count: testData.count,
                    memory: testData.memory,
                    percentageCount: testData.count / fastestsTestIterations * 100,
                    percentageMemory: testData.memory / maxMemoryUsage * 100,
                    formattedTitle: testData.test.title,
                });
            }),
            duration: data.duration,
        };
    };
    return PerfTestAnalyzer;
}());
exports.PerfTestAnalyzer = PerfTestAnalyzer;
