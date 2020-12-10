import { registerInjectable } from "../holders/injectable-holder";
import { Type } from "../type";

export interface InjectableOptions {
}

export function Injectable(parameters: InjectableOptions = {}) {
    return function <T extends Type>(constructor: T) {
        registerInjectable(constructor, parameters);

        return constructor
    }
}
