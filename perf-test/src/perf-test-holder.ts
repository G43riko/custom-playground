import { PerfTestAnalyzer } from "./perf-test-analyzer";
import { PerfTestParser } from "./perf-test-parser";
import { PerfTestRunner } from "./perf-test-runner";
import { PerfTestPrinter } from "./printers/perf-test-printer";

export interface PerfTestOptions {
    testMemory?: boolean;
}

export class PerfTestHolder {
    private readonly parser   = new PerfTestParser(this.fileContent);
    private readonly runner   = new PerfTestRunner(this.options);
    private readonly analyzer = new PerfTestAnalyzer();

    public constructor(private readonly fileContent: string,
                       private readonly options: PerfTestOptions = {},
                       private readonly printer                  = new PerfTestPrinter()) {
    }

    public runAllTests(): void {
        this.printer.printTestTitle(this.parser.extractHeader("title"));
        const beforeAll          = this.parser.extractHeader("beforeAll");
        const thisArg            = this.parser.extractHeader("thisArg");
        const testResults        = this.runner.runTests(this.parser.data, thisArg);
        const testAnalyzeResults = this.analyzer.analyzeTestResults(testResults);

        this.printer.printAnalyzerResult(testAnalyzeResults);
    }
}
