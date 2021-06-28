import {ScriptingCommandParamDataHolder} from "./scripting-command-param-data-holder";
import {CommandParamParserFinalResult} from "./parsers/command-param-parser";
import {ScriptingCommand} from "./scripting-command";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";

export class ScriptingCommandParser {
    private constructor(
        private readonly command: ScriptingCommand,
        private readonly parameterArray: ScriptingCommandParamDataHolder[],
    ) {
    }

    public static createFromCommandAndParserDataHolder(command: ScriptingCommand, dataHolder: ScriptingParserDataProvider): ScriptingCommandParser {
        const [name, ...params] = command.pattern.trim().split(" ");

        console.assert(name === command.name, "Pattern must stars with command name");
        const paramsArray = params.map((param: string) => ScriptingCommandParamDataHolder.fromParameter(param, dataHolder));

        return new ScriptingCommandParser(command, paramsArray);
    }

    public async validate(data: (CommandParamParserFinalResult<unknown> | null)[]): Promise<{ message: string }[] | null> {
        if (!this.command.validator) {
            console.warn("Cannot validate object when validator is not provided to the parser");

            return null;
        }

        return await this.command.validator.validate(data);
    }

    public parse(command: string): (CommandParamParserFinalResult<unknown> | null)[] | null {
        if (command.indexOf(this.command.name + " ") !== 0) {
            console.warn("Not valid command", command, this.command.name);

            return null;
        }

        let currentText = command.substr(this.command.name.length + 1);

        return this.parameterArray.map((parameter, index) => {
            const parserResult = parameter.parse(currentText);
            if (!parserResult) {
                console.warn(`Cannot parse ${index + 1} parameter ${parameter} of '${this.command.pattern}'`);

                return null;
            }

            const rawData = currentText.substr(0, currentText.length - parserResult.remains.length);

            currentText = parserResult.remains.trim();

            return {
                rawData,
                data: parserResult.result,
                type: parameter.typeData,
            };
        });
    }

}
