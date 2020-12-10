import { PerfTestAnalyzerResult } from "./types/perf-test-analyzer-result";

export declare class PerfTestPrinter {
    printTestTitle(title: string): void;

    printAnalyzerResult(data: PerfTestAnalyzerResult): void;
}
