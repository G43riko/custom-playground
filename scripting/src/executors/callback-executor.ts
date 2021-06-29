import {ScriptingCommandExecutor} from "./scripting-command-executor";
import {ScriptingCommandParamParserResult} from "../parsers/scripting-command-param-parser-result";

export class CallbackExecutor<T = unknown, S = void> implements ScriptingCommandExecutor<T, S> {
    public constructor(private readonly callback: (data: T) => S) {
    }

    public execute(data: T): S {
        return this.callback(data);
    }

    public executeRaw(data: (ScriptingCommandParamParserResult<T> | null)[] | null): S {
        if (!data) {
            return null as unknown as S;
        }

        return this.execute(data.map((e) => e?.data) as any);
    }
}
