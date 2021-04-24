export interface ScriptingCommandExecutor<R = unknown, S = unknown> {
    execute(_data: R): S | Promise<S>;

    executeRaw(data: ({ type: { type: string; array: boolean }; rawData: string; data: R } | null)[] | null): S | Promise<S>;
}
