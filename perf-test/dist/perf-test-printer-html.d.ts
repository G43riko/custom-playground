import { PerfTestPrinter } from "./perf-test-printer";
import { PerfTestAnalyzerResult } from "./types/perf-test-analyzer-result";

export declare class PerfTestPrinterHtml implements PerfTestPrinter {
    private readonly parent;

    constructor(parent: HTMLElement);

    printTestTitle(title: string): void;

    printAnalyzerResult(data: PerfTestAnalyzerResult): void;
}
