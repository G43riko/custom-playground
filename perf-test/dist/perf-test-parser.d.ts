import { PerfTest } from "./types/perf-test";

export declare class PerfTestParser {
    readonly data: readonly PerfTest[];
    private readonly header;

    constructor(fileContent: string);

    extractHeader(key: string): string;

    private getLastMatch;
    private processTestContents;
}
