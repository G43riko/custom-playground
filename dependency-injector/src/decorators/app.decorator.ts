import { registerApp } from "../holders/app-holder";
import { Type } from "../type";

export interface AppOptions {
    modules?: Type[];
    name?: string;
    providers?: Type[];
}

export function App(options: AppOptions = {}) {
    return function <T extends Type>(constructor: T) {
        registerApp(constructor, options);
        return constructor
    }
}
