import { PerfTest } from "./types/perf-test";
import { PerfTestResult } from "./types/perf-test-result";
import { PerfTestsResult } from "./types/perf-tests-result";

export declare const gc: () => void;

export class PerfTestRunner {
    public runTest(test: PerfTest): PerfTestResult {
        let count = 0
        const now = Date.now();

        const startMemory = this.getMemory();
        if (typeof gc === "function") {
            gc();
        }
        const finishTime = now + 1000;
        while (finishTime > Date.now()) {
            test.content();
            count++;
        }

        const duration = Date.now() - now;
        const memory   = Math.max(this.getMemory() - startMemory, 0);

        return {count, duration, test, memory};
    }

    public runTests(tests: readonly PerfTest[]): PerfTestsResult {
        const now = Date.now();

        const testsData = tests.map((test) => this.runTest(test));

        const duration = Date.now() - now;

        return {duration, testsData};
    }

    private getMemory(): number {
        // @ts-ignore-next-line
        const performanceMemory = performance?.memory?.usedJSHeapSize;
        if (performanceMemory) {
            return performanceMemory;
        }

        // @ts-ignore-next-line
        const processMemory = process?.memoryUsage()?.heapUsed;
        if (processMemory) {
            return processMemory;
        }
        return 0;
    }
}
