import {ScriptingCommandParser} from "./scripting-command-parser";
import {CommandParamParserFinalResult} from "./parsers/command-param-parser";
import {ScriptingCommand} from "./scripting-command";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";

export interface ScriptingParserOptions {
    readonly oneLineCommentPrefix: string;
    readonly rowDivider: string;
}

export interface CommandParserResult {
    /**
     * Raw command etc. 'ECHO Gabriel'
     */
    readonly raw: string;

    /**
     * Parsed parameter results or null if parameter cannot be parsed.
     * This property is send to {@link ScriptingCommandExecutor.executeRaw}
     */
    readonly data: (CommandParamParserFinalResult<unknown> | null)[] | null;

    /**
     * Trimmed name of command
     */
    readonly command: string;

    /**
     * List of validation errors
     */
    readonly validationErrors?: { message: string }[] | null;
}

function processParams(params: Partial<ScriptingParserOptions>): ScriptingParserOptions {
    return {
        oneLineCommentPrefix: params.oneLineCommentPrefix ?? "#",
        rowDivider: params.rowDivider ?? "\n",
    };
}

export class ScriptingParser {
    private readonly commandParserMap: { readonly [commandName: string]: ScriptingCommandParser } = {};
    private readonly params: ScriptingParserOptions;

    public constructor(
        /**
         * List of all available commands
         */
        private readonly commands: readonly ScriptingCommand[],
        private readonly dataHolder: ScriptingParserDataProvider,
        params: Partial<ScriptingParserOptions> = {},
    ) {
        this.params = processParams(params);
        this.commandParserMap = commands.reduce((acc, command) => {
            return Object.assign(
                acc,
                {
                    [command.name]: ScriptingCommandParser.createFromCommandAndParserDataHolder(command, dataHolder),
                },
            );
        }, {});
    }

    /**
     *
     * @param data - [Command name, command pattern without title]
     * @param dataHolder
     */
    public static fromPatterns(data: [string, string][], dataHolder: ScriptingParserDataProvider): ScriptingParser {
        return new ScriptingParser(data.map(([name, pattern]) => ({name, pattern: `${name} ${pattern}`})), dataHolder);
    }

    public parse(content: string): CommandParserResult[] {
        const validLines = content.split(this.params.rowDivider)
            .map((row) => row.trim())
            .filter((row) => row && row.indexOf(this.params.oneLineCommentPrefix) !== 0);

        return validLines.map((line) => {
            const commandMatch = line.match(/^(\w+) /);
            if (!commandMatch) {
                throw new Error(`Cannot determine command for row '${line}'`);
            }
            const command = this.commandParserMap[commandMatch[1]];

            if (!command) {
                throw new Error("Cannot find command " + commandMatch[1] + " within " + Object.keys(this.commandParserMap));
            }

            return {
                raw: line,
                data: command.parse(line),
                command: commandMatch[1],
            };

        });
    }

    public async parseAndValidate(content: string): Promise<CommandParserResult[]> {
        const validLines = content.split(this.params.rowDivider)
            .map((row) => row.trim())
            .filter((row) => row && row.indexOf(this.params.oneLineCommentPrefix) !== 0);

        const result: CommandParserResult[] = [];

        for (const line of validLines) {
            const commandMatch = line.match(/^(\w+) /);
            if (!commandMatch) {
                throw new Error(`Cannot determine command for row '${line}'`);
            }
            const command = this.commandParserMap[commandMatch[1]];

            if (!command) {
                throw new Error("Cannot find command " + commandMatch[1] + " within " + Object.keys(this.commandParserMap));
            }

            const data = command.parse(line);

            // eslint-disable-next-line no-await-in-loop
            const validationErrors = data ? await command.validate(data) : null;

            result.push({
                data,
                validationErrors,
                raw: line,
                command: commandMatch[1],
            });
        }

        return result;
    }
}
