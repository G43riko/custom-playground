import * as fs from "fs";
import { ParsedArguments } from "g-shared-library";
import { PerfTestHolder } from "./perf-test-holder";

class CliRunner {
    public static start(): void {
        const parsedArgs  = ParsedArguments.createProcessArgs();
        const filePath    = parsedArgs.firstResolvedFile;
        const fileContent = fs.readFileSync(filePath, {encoding: "utf8"});

        const testRunner = new PerfTestHolder(fileContent, {testMemory: parsedArgs.hasFlag("--memory")});
        testRunner.runAllTests();
    }
}

CliRunner.start();
