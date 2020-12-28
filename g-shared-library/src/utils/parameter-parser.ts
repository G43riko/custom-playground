import glob from "glob";
import path from "path";
import { FileHolder } from "./file-holder";

export class ParsedArguments {
    private constructor(
        private readonly runner: string,
        private readonly script: string,
        private readonly params: string[],
    ) {
    }

    public get first(): string {
        return this.params[0];
    }

    public get firstResolvedFile(): string {
        return path.resolve(this.first);
    }

    public get globSync(): string[] {
        return glob.sync(this.first);
    }

    public get globFilesSync(): string[] {
        return this.globSync.filter(FileHolder.isFile);
    }

    public static createProcessArgs(args = process.argv): ParsedArguments {
        const [runner, script, ...params] = args;

        return new ParsedArguments(runner, script, params);

    }

    public get globResolvedFilesSync(): string[] {
        return this.globFilesSync.map((e) => path.resolve(e));
    }

    public hasFlag(flag: string): boolean {
        return this.params.includes(flag);
    }
}
