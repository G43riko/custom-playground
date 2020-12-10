import { PerfTest } from "./types/perf-test";

export declare class PerfTestParser {
    readonly data: readonly PerfTest[];
    private readonly header;
    private proccessTestContents;

    constructor(fileContent: string);

    extractHeader(key: string): string;
}
