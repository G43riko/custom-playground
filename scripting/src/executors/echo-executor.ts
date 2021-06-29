import {ScriptingCommandExecutor} from "./scripting-command-executor";
import {ScriptingCommandParamParserResult} from "../parsers/scripting-command-param-parser-result";

export class EchoExecutor implements ScriptingCommandExecutor<string[]> {
    public execute(data: string[]): void {
        console.log(...data);
    }

    public executeRaw(data: (ScriptingCommandParamParserResult<string[]> | null)[] | null): void {
        if (!data?.[0]) {
            throw new Error("Invalid object " + JSON.stringify(data));
        }

        return this.execute(data[0].data);
    }
}
