import { PerfTest } from "./types/perf-test";
import { PerfTestResult } from "./types/perf-test-result";
import { PerfTestsResult } from "./types/perf-tests-result";

export declare const gc: () => void;

export declare class PerfTestRunner {
    private getMemory;

    runTest(test: PerfTest): PerfTestResult;

    runTests(tests: readonly PerfTest[]): PerfTestsResult;
}
