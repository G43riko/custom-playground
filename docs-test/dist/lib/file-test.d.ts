export declare class FileTest {
    private readonly tests;

    private constructor();

    static create(fileContent: string): FileTest | null;

    getTextContentForFile(absoluteFilePath: string, useEs?: boolean, forceName?: string): string;
}
