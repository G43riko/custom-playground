import { PerfTest } from "./perf-test";

export interface PerfTestResult {
    readonly count: number;
    readonly duration: number;
    readonly memory?: number;
    readonly test: PerfTest;
}
