import { Type } from "../type";
import { CustomProvider } from "./custom-provider";

export type ProviderType<T = any> = Type<T> | CustomProvider<T>;
export type ProviderToken<T = any> = Type<T> | string;

export interface Provider<T = any> {
    readonly token: ProviderToken<T>;
    readonly instance: T;
}
