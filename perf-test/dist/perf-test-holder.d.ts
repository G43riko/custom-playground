import { PerfTestPrinter } from "./printers/perf-test-printer";

export interface PerfTestOptions {
    testMemory?: boolean;
}
export declare class PerfTestHolder {
    private readonly fileContent;
    private readonly options;
    private readonly printer;
    private readonly parser;
    private readonly runner;
    private readonly analyzer;
    constructor(fileContent: string, options?: PerfTestOptions, printer?: PerfTestPrinter);
    runAllTests(): void;
}
