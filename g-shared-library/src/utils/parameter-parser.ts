import glob from "glob";
import path from "path";
import { FileHolder } from "./file-holder";

export class ParsedArguments {
    private readonly processedParameters: {
        [parameter: string]: {
            value?: string
            values?: string[]
        }
    } = {}

    private constructor(
        /**
         * node/ts-node
         */
        private readonly runner: string,
        /**
         * path to script.
         */
        private readonly script: string,
        /**
         * Real params
         */
        private readonly params: string[],
    ) {
        for (let i = 0; i < params.length;) {
            const currentParam = params[i];
            if (currentParam.startsWith("--")) {
                const paramName = currentParam.substring(2);

                const values: string[] = [];

                let tmpIndex = i + 1;
                while (params[tmpIndex] && !params[tmpIndex].startsWith("--")) {
                    values.push(params[tmpIndex++]);
                }

                this.processedParameters[paramName] = {
                    value : values[0],
                    values: values.length ? values : [],
                };
                i                                   = tmpIndex;
            } else {
                i++;
            }
        }
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
