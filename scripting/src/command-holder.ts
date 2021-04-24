import { CommandParamHolder } from "./command-param-holder";
import { ScriptingCommand } from "./scripting-command";
import { ScriptingParserDataHolder } from "./scripting-parser-data-holder";

export class CommandHolder {
    private readonly params: CommandParamHolder[];

    public constructor(
        private readonly command: ScriptingCommand,
        dataHolder: ScriptingParserDataHolder,
    ) {
        const [name, ...params] = command.pattern.trim().split(" ");

        console.assert(name === command.name, "Pattern must stars with command name");

        this.params = params.map((param: string) => CommandParamHolder.fromParameter(param, dataHolder));
    }


    public parse(command: string): unknown[] | null {
        if (command.indexOf(this.command.name + " ") !== 0) {
            console.warn("Not valid command", command, this.command.name);

            return null;
        }

        let currentText = command.substr(this.command.name.length + 1);

        return this.params.map((parameter, index) => {
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
