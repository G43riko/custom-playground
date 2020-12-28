import { PerfTestAnalyzerResult } from "./types/perf-test-analyzer-result";
import { PerfTestsResult } from "./types/perf-tests-result";

export class PerfTestAnalyzer {
    public analyzeTestResults(data: PerfTestsResult): PerfTestAnalyzerResult {
        const fastestsTestIterations = Math.max(...data.testsData.map((d) => d.count));
        const maxMemoryUsage         = data.options.testMemory ? Math.max(...data.testsData.map((d) => d.memory!)) : 0;

        return {
            fastestsTestIterations,
            maxMemoryUsage,
            maxTitleLength: Math.max(...data.testsData.map((d) => d.test.title.length)),
            tests         : data.testsData.map((testData) => ({
                title           : testData.test.title,
                count           : testData.count,
                memory          : testData.memory,
                percentageCount : testData.count / fastestsTestIterations * 100,
                percentageMemory: data.options.testMemory ? (testData.memory! / maxMemoryUsage * 100) : undefined,
                formattedTitle  : testData.test.title,
            })),
            duration      : data.duration,
        };
    }
}
