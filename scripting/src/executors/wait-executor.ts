import {ScriptingCommandExecutor} from "./scripting-command-executor";
import {ScriptingCommandParamParserResult} from "../parsers/scripting-command-param-parser-result";

export class WaitExecutor implements ScriptingCommandExecutor<{ unit: string, duration: number }> {
    public execute(time: { unit: string, duration: number }): Promise<void> {
        return new Promise((success, reject) => {
            try {
                setTimeout(success, this.getMsFromTime(time.unit, time.duration));
            } catch (e) {
                reject(e);
            }
        });
    }

    public executeRaw(data: (ScriptingCommandParamParserResult<{ unit: string, duration: number }> | null)[] | null): Promise<void> {
        if (!data?.[0]) {
            throw new Error("Invalid object " + JSON.stringify(data));
        }

        return this.execute(data[0].data);
    }

    private getMsFromTime(unit: string, duration: number): number {
        switch (unit) {
            case "MS":
                return duration;
            case "S":
                return duration * 1000;
            case "M":
                return duration * 1000 * 60;
            case "H":
                return duration * 1000 * 60 * 60;
            case "D":
                return duration * 1000 * 60 * 60 * 24;
            default:
                throw new Error("Cannot convert unit " + unit + " to ms");
        }
    }
}
