import { ScriptingCommandExecutor } from "./executors/scripting-command-executor";
import { ScriptingParser } from "./scripting-parser";
import { ScriptingParserDataHolder } from "./scripting-parser-data-holder";

export class ScriptingExecutor {
    public constructor(
        private readonly parser: ScriptingParser,
        private readonly executorMap: { [command in string]: ScriptingCommandExecutor },
    ) {
    }

    /**
     *
     * @param data - [command name, pattern without command name, ]
     * @param dataHolder
     */
    public static fromRowData(data: [string, string, ScriptingCommandExecutor][], dataHolder: ScriptingParserDataHolder): ScriptingExecutor {
        const parser = new ScriptingParser(data.map(([name, pattern]) => ({
            name,
            pattern: `${name} ${pattern}`
        })), dataHolder);

        return new ScriptingExecutor(
            parser,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            data.reduce((acc, [name, _, executor]) => Object.assign(acc, {[name]: executor}), {}),
        );
    }

    public execute(content: string): unknown[] {
        const parsedData = this.parser.parseContent(content);


        return parsedData.map((data) => {
            const executor = this.executorMap[data.command];
            if (!executor) {
                console.warn("Cannot find executor for command " + data.command);

                return;
            }

            return executor.execute(data.data);
        });
    }

    public async executeSync(content: string): Promise<unknown[]> {
        const parsedData = this.parser.parseContent(content);

        const result: unknown[] = [];

        for (const data of parsedData) {
            const executor = this.executorMap[data.command];
            if (!executor) {
                console.warn("Cannot find executor for command " + data.command);

                result.push(null);
            }

            // eslint-disable-next-line no-await-in-loop
            result.push(await executor.executeRaw(data.data));
        }

        return result;

    }
}
