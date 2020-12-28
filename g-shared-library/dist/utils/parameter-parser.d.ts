export declare class ParsedArguments {
    private readonly runner;
    private readonly script;
    private readonly params;
    private constructor();
    get first(): string;
    get firstResolvedFile(): string;
    get globSync(): string[];
    get globFilesSync(): string[];

    hasFlag(flag: string): boolean;

    get globResolvedFilesSync(): string[];
    static createProcessArgs(args?: string[]): ParsedArguments;
}
