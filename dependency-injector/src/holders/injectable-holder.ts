import { InjectableOptions } from "..";
import { Type } from "../type";

interface InjectableHolder<T = any> {
    injectable: Type<T>
    instance?: T;
    options: InjectableOptions;
}

const injectables: Map<any, InjectableHolder> = new Map();

export function registerInjectable(injectable: any, options: InjectableOptions): void {
    injectables.set(injectable, {
        injectable,
        options,
    });
}
