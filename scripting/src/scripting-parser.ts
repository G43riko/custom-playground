import {ScriptingCommandParser} from "./scripting-command-parser";
import {ScriptingCommand} from "./scripting-command";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";
import {ScriptingCommandParserResult} from "./scripting-command-parser-result";

export interface ScriptingParserOptions {
    readonly oneLineCommentPrefix: string;
    readonly rowDivider: string;
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

    public parse(content: string): ScriptingCommandParserResult[] {
        const validLines = content.split(this.params.rowDivider)
            .map((row) => row.trim())
            .filter((row) => row && row.indexOf(this.params.oneLineCommentPrefix) !== 0);

        return validLines.map((line) => {
            const commandMatch = line.match(/^(\w+)\W/);
            if (!commandMatch) {
                throw new Error(`Cannot determine command name for row '${line}'`);
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

    public async parseAndValidate(content: string): Promise<ScriptingCommandParserResult[]> {
        const validLines = content.split(this.params.rowDivider)
            .map((row) => row.trim())
            .filter((row) => row && row.indexOf(this.params.oneLineCommentPrefix) !== 0);

        const result: ScriptingCommandParserResult[] = [];

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
            if (!data || !validationErrors) {
                result.push({
                    data,
                    validationErrors: null,
                    raw: line,
                    command: commandMatch[1],
                });

                break;
            }

            if (validationErrors.commandErrors) {
                console.assert(validationErrors.commandErrors.length === data.length, "Something is wrong");
            }

            result.push({
                data: validationErrors ? data.map((item, i) => Object.assign({}, item, {validationErrors: validationErrors.parameterErrors[i]})) : data,
                validationErrors: validationErrors?.commandErrors,
                raw: line,
                command: commandMatch[1],
            });
        }

        return result;
    }
}
