import { PerfTestPrinter } from "./perf-test-printer";

export declare class PerfTestHolder {
    private readonly fileContent;
    private readonly printer;
    private readonly parser;
    private readonly runner;
    private readonly analyzer;

    constructor(fileContent: string, printer?: PerfTestPrinter);

    runAllTests(): void;
}
