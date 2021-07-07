import { PerfTestOptions } from "../perf-test-holder";
import { PerfTestResult } from "./perf-test-result";

export interface PerfTestsResult {
    readonly testsData: readonly PerfTestResult[];
    readonly duration: number;
    readonly options: PerfTestOptions;
}
