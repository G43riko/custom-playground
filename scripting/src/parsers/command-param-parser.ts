export interface CommandParamParser<T = unknown> {
    parse(value: string): { remains: string, result: T } | null;
}
