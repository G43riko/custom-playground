export declare const DOCS_TEST_KEY = "TESTED_OBJ";
export declare const utils: {
    tabs(count: number): string;
    createDescribe: (title: string, data: unknown, tabs?: number) => string;
};
export declare const regexps: {
    startComment: string;
    endComment: string;
    endLine: string;
    anyChar: string;
    operatorPattern: RegExp;
    nextJsDocOrEnd: string;
    tsJsExtension: RegExp;
};
export declare const commentRegexp: RegExp;
export declare const testMethod: {
    getTestsFor: (fullPath: string) => string;
    generateTestForInto: (fullPath: string, testFilePath?: string) => void;
    generateForCurrentArgs(): void;
};
