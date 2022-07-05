export interface PerfTestAnalyzerResult {
    readonly maxTitleLength: number;
    readonly duration: number;
    readonly maxMemoryUsage: number;
    readonly fastestTestIterations: number;
    readonly tests: {
        readonly title: string;
        readonly count: number;
        readonly memory?: number;
        readonly percentageCount: number;
        readonly percentageMemory?: number;
    }[];
}