import { CommandParamParserFinalResult } from "../parsers/command-param-parser";
import { ScriptingCommandExecutor } from "./scripting-command-executor";

export class EchoExecutor implements ScriptingCommandExecutor<string[]> {
    public execute(data: string[]): void {
        console.log(...data);
    }

    public executeRaw(data: (CommandParamParserFinalResult<string[]> | null)[] | null): void {
        if (!data?.[0]) {
            throw new Error("Invalid object " + JSON.stringify(data));
        }

        return this.execute(data[0].data);
    }
}
