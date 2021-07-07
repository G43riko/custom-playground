import { PerfTestOptions } from "./perf-test-holder";
import { PerfTest } from "./types/perf-test";
import { PerfTestResult } from "./types/perf-test-result";
import { PerfTestsResult } from "./types/perf-tests-result";

export declare const gc: () => void;

export declare class PerfTestRunner {
    private readonly options;

    constructor(options: PerfTestOptions);

    runTest(test: PerfTest, thisArg: unknown): PerfTestResult;

    runTests(tests: readonly PerfTest[], thisArgContent: string): PerfTestsResult;

    private getMemory;
}
