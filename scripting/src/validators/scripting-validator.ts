export interface ScriptingValidator<T> {
    validate(data: T): Promise<boolean>
}
