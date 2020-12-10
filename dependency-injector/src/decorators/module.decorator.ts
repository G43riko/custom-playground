import { registerModule } from "../holders/module-holder";
import { ProviderType } from "../providers/provider.interface";
import { Type } from "../type";


export interface ModuleOptions {
    name?: string;
    providers?: ProviderType[];
    imports?: (ProviderType & Type)[];
}

export function Module(options: ModuleOptions = {}) {
    return function <T extends Type>(constructor: T) {
        registerModule(constructor, options);

        return constructor
    }
}
