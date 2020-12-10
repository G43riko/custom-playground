import { ParsedArguments } from "g-shared-library";
import { PerfTestHolder } from "./perf-test-holder";

class CliRunner {
    public static start(): void {
        // @ts-ignore-next-line
        const fs          = require("fs");
        // @ts-ignore-next-line
        const filePath    = ParsedArguments.createProcessArgs().firstResolvedFile;
        const fileContent = fs.readFileSync(filePath, {encoding: "utf8"});

        const testRunner = new PerfTestHolder(fileContent);
        testRunner.runAllTests();
    }
}
