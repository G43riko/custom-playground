import { PerfTestPrinter } from "./perf-test-printer";
import { PerfTestAnalyzerResult } from "./types/perf-test-analyzer-result";

export class PerfTestPrinterHtml implements PerfTestPrinter {
    public constructor(private readonly parent: HTMLElement) {
    }

    public printTestTitle(title: string): void {
        const titleDivider = "=".repeat(title.length);

        const data = [
            titleDivider,
            title,
            titleDivider,
        ];

        this.parent.innerHTML += data.join("<br/>") + "<br/>";
    }

    public printAnalyzerResult(data: PerfTestAnalyzerResult): void {
        data.tests.forEach((item) => {
            this.parent.innerHTML += "<br/>";
            this.parent.innerHTML += item.title + " - " + " ".repeat(data.maxTitleLength - item.title.length) + item.count + " calls per second.";
            this.parent.innerHTML += "<span style='color: green'> " + item.memory + " bytes of memory used</span><br/>";
            this.parent.innerHTML += "#".repeat(Math.floor(item.percentageCount)) + "<br/>";
            this.parent.innerHTML += "<span style='color:green'>" + "#".repeat(Math.floor(item.percentageMemory)) + "</span><br/><br/>";
        });
    }
}
