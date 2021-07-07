export declare class ParsedArguments {
    /**
     * node/ts-node
     */
    private readonly runner;
    /**
     * path to script.
     */
    private readonly script;
    /**
     * Real params
     */
    private readonly params;
    private readonly processedParameters;
    private constructor();
    get first(): string;
    get firstResolvedFile(): string;
    get globSync(): string[];
    get globFilesSync(): string[];
    static createProcessArgs(args?: string[]): ParsedArguments;
    get globResolvedFilesSync(): string[];
    hasFlag(flag: string): boolean;
}
