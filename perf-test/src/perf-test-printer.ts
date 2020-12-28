import { currentEOL } from "g-shared-library";
import { PerfTestAnalyzerResult } from "./types/perf-test-analyzer-result";

export class PerfTestPrinter {
    public printTestTitle(title: string): void {
        const titleDivider = "=".repeat(title.length);

        const data = [
            titleDivider,
            title,
            titleDivider,
        ];

        console.log(data.join(currentEOL));
    }

    public printAnalyzerResult(data: PerfTestAnalyzerResult): void {
        data.tests.forEach((item) => {
            console.log(item.title + " - " + " ".repeat(data.maxTitleLength - item.title.length) + item.count + " calls per second");
            console.log("#".repeat(Math.floor(item.percentageCount)));
            // console.log("%c #".repeat(Math.floor(item.percentageMemory)), "color: red");

            if (item.memory) {
                console.log("#".repeat(Math.floor(item.percentageMemory!)));
            }
        });
    }
}
