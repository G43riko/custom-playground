import { PerfTestAnalyzer } from "./perf-test-analyzer";
import { PerfTestParser } from "./perf-test-parser";
import { PerfTestPrinter } from "./perf-test-printer";
import { PerfTestRunner } from "./perf-test-runner";

export class PerfTestHolder {
    private readonly parser   = new PerfTestParser(this.fileContent);
    private readonly runner   = new PerfTestRunner();
    private readonly analyzer = new PerfTestAnalyzer();

    public constructor(private readonly fileContent: string,
                       private readonly printer = new PerfTestPrinter()) {
    }

    public runAllTests(): void {
        this.printer.printTestTitle(this.parser.extractHeader("title"));

        const testResults        = this.runner.runTests(this.parser.data);
        const testAnalyzeResults = this.analyzer.analyzeTestResults(testResults);

        this.printer.printAnalyzerResult(testAnalyzeResults);
    }
}
