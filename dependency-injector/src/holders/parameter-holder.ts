import { GLogger } from "gtools/GUtils";
import { ProviderToken } from "../providers/provider.interface";
import { Type } from "../type";
import { ForwardRefFn } from "./forward-ref-holder";

export interface ParameterDecorator {
    forwardRef?: ForwardRefFn;
    injectToken?: ProviderToken;
    optional?: boolean;
    factoryRef?: boolean;
    moduleRef?: boolean;
    appRef?: boolean;
}


interface ClassDecoratorData {
    [methodName: string]: { [index in number]?: ParameterDecorator };
}

const data: Map<Type<any>, ClassDecoratorData> = new Map();

function getParameterDecoratorData<T>(target: Type<T>, propertyKey: string, parameterIndex: number): ParameterDecorator {
    GLogger.log("Getting inject for " + target.name + "[" + propertyKey + "](" + parameterIndex + ")", "Inject");

    if (!data.has(target)) {
        data.set(target, {});
    }

    const classData = data.get(target) as ClassDecoratorData;
    if (!classData[propertyKey]) {
        classData[propertyKey] = {}
    }

    const methodData = classData[propertyKey];

    if (!methodData[parameterIndex]) {
        methodData[parameterIndex] = {};
    }

    return methodData[parameterIndex] as ParameterDecorator;
}

export function getParameterDecorator<T extends keyof ParameterDecorator>(
    target: Type<any>,
    propertyKey: string,
    parameterIndex: number,
    key: T
): ParameterDecorator[T] {
    GLogger.log("Getting " + key + " for " + target.name + "[" + propertyKey + "](" + parameterIndex + ")", "ParameterDecorator");
    const parameterData = getParameterDecoratorData(target, propertyKey, parameterIndex);
    return parameterData[key];
}

export function registerParameterDecorator<T extends keyof ParameterDecorator>(
    target: Type,
    propertyKey: string,
    parameterIndex: number,
    key: T, value: ParameterDecorator[T]
) {
    GLogger.log("Registering " + key + " for " + target.name + "[" + propertyKey + "](" + parameterIndex + ")", "ParameterDecorator");
    const parameterData = getParameterDecoratorData(target, propertyKey, parameterIndex);
    parameterData[key]  = value;
}
