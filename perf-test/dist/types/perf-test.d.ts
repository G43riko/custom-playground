export interface PerfTest {
    readonly title: string;
    readonly content: () => void;
    readonly header: string;
}
