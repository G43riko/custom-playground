import { currentEOL, FileHolder, ParsedArguments } from "g-shared-library";
import { createStopWatch } from "gtools/node";
import * as path from "path";
import { FileTest } from "./file-test";

export const DOCS_TEST_KEY = "TESTED_OBJ";

export const utils = {
    tabs(count: number) {
        return "\t".repeat(count);
    },
    createDescribe: (title: string, data: unknown, tabs = 1) => {
        const text = Array.isArray(data) ? data.join(currentEOL) : String(data);

        return [
            `${utils.tabs(tabs - 1)}describe("${title}", () => {`,
            `${utils.tabs(tabs)}${text}`,
            `${utils.tabs(tabs - 1)}});`
        ].join(currentEOL);
    },
};

export const regexps       = {
    startComment   : "\\/\\*\\*",
    endComment     : "\\*\\/",
    endLine        : "(\\n|\\r)",
    anyChar        : "(.|\\n|\\r)",
    // operatorPattern: /(={1,2}>|typeof)/,
    operatorPattern: new RegExp("(={1,2}>|typeof)(?!.*(={1,2}>|typeof))"),
    nextJsDocOrEnd : "(@\\w|\\*\\/)",
    tsJsExtension  : /\.([tj]s)$/,
};
export const commentRegexp = new RegExp(
    `${regexps.startComment}${regexps.endLine}+?(${regexps.anyChar}+?)${regexps.endComment}${regexps.anyChar}+?function +(\\w+)`,
    "gi",
);

export const testMethod = {
    getTestsFor: (fullPath: string): string => {
        const fileContent = FileHolder.readFileSync(fullPath);

        const fileTest = FileTest.create(fileContent);
        if (fileTest) {
            return fileTest.getTextContentForFile(fullPath);
        }
        throw new Error("Cannot create performance-tests for file " + fullPath);
    },

    generateTestForInto: (fullPath: string, testFilePath = fullPath.replace(regexps.tsJsExtension, (_, extension) => ".generated.spec." + extension)) => {
        FileHolder.writeFileSync(testFilePath, testMethod.getTestsFor(fullPath),);
    },

    generateForCurrentArgs(): void {
        const fullFilePaths = ParsedArguments.createProcessArgs().globResolvedFilesSync;

        console.log(fullFilePaths);
        const generationStart = createStopWatch();
        fullFilePaths.forEach((filePath) => {
            const fullFilePath = path.resolve(filePath);
            const fileStart    = createStopWatch();
            testMethod.generateTestForInto(fullFilePath);
            console.log("Generated performance-tests for " + fullFilePath + " in " + fileStart.getDiff());
        });
        console.log("Generated " + fullFilePaths.length + " files for " + generationStart.getDiff());

    }
};
