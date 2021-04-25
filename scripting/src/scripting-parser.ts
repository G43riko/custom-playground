import { CommandHolder } from "./command-holder";
import { CommandParamParserFinalResult } from "./parsers/command-param-parser";
import { ScriptingCommand } from "./scripting-command";
import { ScriptingParserDataHolder } from "./scripting-parser-data-holder";

export interface ScriptingParserOptions {
    readonly oneLineCommentPrefix: string;
    readonly rowDivider: string;
}

export interface CommandParserResult {
    readonly raw: string;
    readonly data: (CommandParamParserFinalResult<unknown> | null)[] | null;
    readonly command: string;
}

function processParams(params: Partial<ScriptingParserOptions>): ScriptingParserOptions {
    return {
        oneLineCommentPrefix: params.oneLineCommentPrefix ?? "#",
        rowDivider          : params.rowDivider ?? "\n",
    };
}

export class ScriptingParser {
    private readonly commandsMap: { readonly [type: string]: CommandHolder } = {};
    private readonly params: ScriptingParserOptions;

    public constructor(
        private readonly commands: readonly ScriptingCommand[],
        private readonly dataHolder: ScriptingParserDataHolder,
        params: Partial<ScriptingParserOptions> = {},
    ) {
        this.params      = processParams(params);
        this.commandsMap = commands.reduce((acc, command) => Object.assign(acc, {[command.name]: new CommandHolder(command, dataHolder)}), {});
    }

    /**
     *
     * @param data - [Command name, command pattern without title]
     * @param dataHolder
     */
    public static fromPatterns(data: [string, string][], dataHolder: ScriptingParserDataHolder): ScriptingParser {
        return new ScriptingParser(data.map(([name, pattern]) => ({name, pattern: `${name} ${pattern}`})), dataHolder);
    }

    public parseContent(content: string): CommandParserResult[] {
        const validLines = content.split(this.params.rowDivider)
                                  .map((row) => row.trim())
                                  .filter((row) => row && row.indexOf(this.params.oneLineCommentPrefix) !== 0);

        return validLines.map((line) => {
            const commandMatch = line.match(/^(\w+) /);
            if (!commandMatch) {
                throw new Error(`Cannot determine command for row '${line}'`);
            }
            const command = this.commandsMap[commandMatch[1]];

            if (!command) {
                throw new Error("Cannot find command " + commandMatch[1] + " within " + Object.keys(this.commandsMap));
            }

            return {
                raw    : line,
                data   : command.parse(line),
                command: commandMatch[1],
            };

        });
    }
}
