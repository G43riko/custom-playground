import { PerfTestAnalyzerResult } from "./types/perf-test-analyzer-result";
import { PerfTestsResult } from "./types/perf-tests-result";

export declare class PerfTestAnalyzer {
    analyzeTestResults(data: PerfTestsResult): PerfTestAnalyzerResult;
}
