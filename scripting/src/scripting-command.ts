export interface ScriptingCommand {
    readonly name: string;
    /**
     * Pattern with parameter list starting with uppercase command name
     */
    readonly pattern: string;
}
