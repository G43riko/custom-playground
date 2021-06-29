import {ScriptingCommandParamDataHolder} from "./scripting-command-param-data-holder";
import {ScriptingCommand} from "./scripting-command";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";
import {ScriptingCommandParamParserResult} from "./parsers/scripting-command-param-parser-result";
import {ScriptingValidatorResult} from "./scripting-validator-result";

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

    public async validate(data: (ScriptingCommandParamParserResult<unknown> | null)[], requireCommandValidation = false): Promise<{
        parameterErrors: ScriptingValidatorResult[],
        commandErrors: ScriptingValidatorResult,
    } | null> {
        if (!data) {
            return null;
        }

        const parameterErrors: ScriptingValidatorResult[] = [];

        let index = 0;
        for (const param of this.parameterArray) {
            const entry = data[index++];

            if (!entry) {
                console.warn(index + " value is null");


                // TODO: if property {@link continue on error} is set to true
                continue;
            }

            // eslint-disable-next-line no-await-in-loop
            parameterErrors.push(await param.validate(entry.data));
        }

        if (!this.command.validator) {
            if (requireCommandValidation) {
                console.error("Cannot validate object when validator is not provided to the parser");
            }

            return {
                parameterErrors,
                commandErrors: null,
            };
        }

        const commandErrors = await this.command.validator.validate(data);

        return {parameterErrors, commandErrors};
    }

    public parse(command: string): (ScriptingCommandParamParserResult<unknown> | null)[] | null {
        if (command.indexOf(this.command.name + " ") !== 0) {
            console.warn("Not valid command", command, this.command.name);

            return null;
        }

        let currentText = command.substr(this.command.name.length + 1);

        return this.parameterArray.map((parameter, index) => {
            const parserSubResult = parameter.parse(currentText);
            if (!parserSubResult) {
                console.warn(`Cannot parse ${index + 1} parameter ${parameter} of '${this.command.pattern}'`);

                return null;
            }

            const rawData = currentText.substr(0, currentText.length - parserSubResult.remains.length);

            currentText = parserSubResult.remains.trim();

            return {
                rawData,
                data: parserSubResult.result,
                type: parameter.typeData,
            };
        });
    }

}
