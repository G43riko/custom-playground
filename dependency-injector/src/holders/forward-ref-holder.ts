import { GLogger } from "gtools/GUtils";
import { ProviderTokenToString } from "../providers/provider-utils";
import { ProviderToken } from "../providers/provider.interface";
import { Type } from "../type";

export type ForwardRefFn<T = any> = () => Type<T>;

const forwardRefKey = "__FORWARD_REF__";
const forwardRef    = Symbol(forwardRefKey);

interface ClassForwardRefs {
    [propertyName: string]: { [index in number]?: ForwardRefFn };
}

const data: Map<any, ClassForwardRefs> = new Map();

export function getForwardRef<T>(target: ProviderToken<T>, propertyKey: string, parameterIndex: number): Type<T> | undefined {
    GLogger.log("Getting forward ref for " + ProviderTokenToString(target) + "[" + propertyKey + "](" + parameterIndex + ")", "ForwardRef");
    const resultA = data.get(target);
    if (!resultA) {
        return;
    }

    const resultB = resultA[propertyKey];
    if (!resultB) {
        return;
    }
    const resultC = resultB[parameterIndex];

    return resolveForwardRef(resultC);
}

export function resolveForwardRef<T>(forwardRefFn?: ForwardRefFn<T>): Type<T> | undefined {
    if (!forwardRefFn) {
        return;
    }

    if (isForwardRef(forwardRefFn)) {
        return forwardRefFn();
    }

    return forwardRefFn as Type<T>;
}

export function isForwardRef<T>(param: ForwardRefFn<T>): param is ForwardRefFn {
    return param && (param as any)[forwardRefKey] === forwardRef;
}

export function createForwardRef<T>(callback: ForwardRefFn<T>): ForwardRefFn<T> {
    (callback as any)[forwardRefKey] = forwardRef;
    return callback;
}

export function registerForwardRef(target: Type, propertyKey: string, parameterIndex: number, callback: ForwardRefFn) {
    GLogger.log("Registering forward ref for " + target.name + "[" + propertyKey + "](" + parameterIndex + ")", "ForwardRef");

    const newData = data.get(target) || {};
    if (!newData[propertyKey]) {
        newData[propertyKey] = {};
    }

    newData[propertyKey][parameterIndex] = createForwardRef(callback);

    data.set(target, newData);
}
