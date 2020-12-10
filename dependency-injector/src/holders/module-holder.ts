import { ModuleOptions } from "..";
import { ProviderTokenToString } from "../providers/provider-utils";
import { ProviderToken } from "../providers/provider.interface";
import { Type } from "../type";

export interface ModuleHolder<T = any> {
    module: Type<T>
    instance?: T;
    options: ModuleOptions;
    initMethod?: () => Promise<void>;
}

const modules: Map<ProviderToken, ModuleHolder> = new Map();

export function registerModule<T>(module: Type<T>, options: ModuleOptions): void {
    modules.set(module, {
        module,
        options,
    });
}

export function getModuleHolderData<T>(token: ProviderToken<T>): ModuleHolder<T> {
    const moduleData = modules.get(token);
    if (!moduleData) {
        throw new Error("Cannot get find module: " + ProviderTokenToString(token));
    }

    return moduleData
}

