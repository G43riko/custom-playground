import {ScriptingCommandValidator} from "./scripting-command-validator";

export interface ScriptingCommand {
    readonly name: string;
    /**
     * Pattern with parameter list starting with uppercase command name
     */
    readonly pattern: string;

    /**
     * Command validator
     */
    readonly validator?: ScriptingCommandValidator,

}
