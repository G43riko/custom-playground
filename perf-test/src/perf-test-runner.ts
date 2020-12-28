import { PerfTestOptions } from "./perf-test-holder";
import { PerfTest } from "./types/perf-test";
import { PerfTestResult } from "./types/perf-test-result";
import { PerfTestsResult } from "./types/perf-tests-result";

export declare const gc: () => void;

export class PerfTestRunner {
    public constructor(private readonly options: PerfTestOptions) {
    }

    public runTest(test: PerfTest, thisArg: unknown): PerfTestResult {
        let count = 0;
        const now = Date.now();

        const startMemory = this.getMemory();

        if (typeof gc === "function") {
            gc();
        }
        const finishTime = now + 1000;
        while (finishTime > Date.now()) {
            test.content.call(thisArg);
            count++;
        }

        const duration = Date.now() - now;
        if (this.options.testMemory) {
            const memory = Math.max(this.getMemory() - startMemory, 0);

            return {count, duration, test, memory};
        }

        return {count, duration, test};
    }

    public runTests(tests: readonly PerfTest[], thisArgContent: string): PerfTestsResult {
        const now     = Date.now();
        const thisArg = new Function(`return ${thisArgContent}`)();

        const testsData = tests.map((test) => this.runTest(test, thisArg));

        const duration = Date.now() - now;

        return {duration, testsData, options: this.options};
    }

    private getMemory(): number {
        // @ts-ignore-next-line
        const performanceMemory = typeof performance !== "undefined" && performance?.memory?.usedJSHeapSize;
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
