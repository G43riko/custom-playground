export interface DataSerializer<T> {
    fromString(data: string): T;

    toString(data: T): string;
}
