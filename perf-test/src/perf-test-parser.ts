import { PerfTest } from "./types/perf-test";

const testDivider    = /\/{9}/gim;
const headerSelector = ": ?(.+)[\n\r]{1,2}";

export class PerfTestParser {
    public readonly data: readonly PerfTest[];
    private readonly header: string;

    public constructor(fileContent: string) {
        const [header, ...testContents] = fileContent.split(testDivider);
        this.header                     = header;
        this.data                       = this.proccessTestContents(testContents);
    }

    public extractHeader(key: string): string {
        const result = this.header.match(new RegExp(key + headerSelector, "i"));

        return result ? result[1] : "";
    }

    private proccessTestContents(testContents: string[]): PerfTest[] {
        return testContents.map((content) => {
            const result = content.match(/\/ ?(.+)[\n\r]+((.|\n|\r)+)/i);
            if (!result) {
                return null;
            }
            return {
                title  : result[1],
                content: new Function(result[2]),
                header : "____" + Math.random(),
            }
        }).filter((e) => e) as PerfTest[];
    }
}
