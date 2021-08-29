import {DataSerializer} from "./data-serializer";

export class JsonSerializer<T> implements DataSerializer<T> {
    public fromString(data: string): T {
        return JSON.parse(data);
    }

    public toString(data: T): string {
        return JSON.stringify(data);
    }
}
