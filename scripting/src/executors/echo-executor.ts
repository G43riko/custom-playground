import { ScriptingCommandExecutor } from "./scripting-command-executor";

export class EchoExecutor implements ScriptingCommandExecutor {
    public execute(data: string[]): void {
        console.log(...data);
    }

    public executeRaw(data: ({ type: { type: string; array: boolean }; rawData: string; data: string[] } | null)[] | null): void {
        if (!data?.[0]) {
            throw new Error("Invalid object " + JSON.stringify(data));
        }

        return this.execute(data[0].data);
    }
}
