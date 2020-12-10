export interface PerfTestAnalyzerResult {
    readonly maxTitleLength: number;
    readonly duration: number;
    readonly maxMemoryUsage: number;
    readonly fastestsTestIterations: number;
    readonly tests: {
        readonly title: string;
        readonly count: number;
        readonly memory: number;
        readonly percentageCount: number;
        readonly percentageMemory: number;
    }[];
}
