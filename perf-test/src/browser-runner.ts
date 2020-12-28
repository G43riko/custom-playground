import { PerfTestHolder } from "./perf-test-holder";
import { PerfTestPrinterHtml } from "./perf-test-printer-html";

class BrowserRunner {
    public static start(): void {
        const tester = new BrowserRunner();
        tester.appendTo("body");
    }

    public appendTo(target: string | HTMLElement, parent = document): void {
        const targetElement     = (typeof target === "string" ? parent.querySelector(target) : target) as HTMLElement;
        targetElement.innerHTML = "";

        const inputArea       = parent.createElement("textarea");
        inputArea.placeholder = `Place your tests here. 
Example:

/*
title: Array spread operator vs Object.assign
*/
////////// Spread
const a = ["a", "b", "c"];
const b = [...a];
////////// Assign
const a = ["a", "b", "c"];
const b = Object.assign([], a);
`;
        inputArea.cols        = 100;
        inputArea.rows        = 20;
        inputArea.value       = `/*
title: Array spread operator vs Object.assign
*/
////////// Spread
const a = ["a", "b", "c"];
const b = [...a];
////////// Assign
const a = ["a", "b", "c"];
const b = Object.assign([], a);
////////// Concat
const a = ["a", "b", "c"];
const b = [].concat(a);`;

        const outputWrapper = parent.createElement("div");


        const processButton     = parent.createElement("button");
        processButton.innerText = "process";
        processButton.onclick   = () => this.onChange(inputArea.value, outputWrapper);


        targetElement.append(processButton);
        targetElement.append(inputArea);
        targetElement.append(outputWrapper);
    }

    private onChange(testContent: string, outputWrapper: HTMLDivElement): void {
        const tests = new PerfTestHolder(testContent, {}, new PerfTestPrinterHtml(outputWrapper));
        tests.runAllTests();
    }
}
