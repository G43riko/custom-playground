import { ProviderToken } from "../providers/provider.interface";

export interface Factory {
    require<T>(token: ProviderToken<T>): T;

    getDependency<T>(token: ProviderToken<T>, defaultValue?: T, calledFromFactory?: Factory): T | undefined;
}
