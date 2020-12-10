import { ForwardRefFn, registerForwardRef } from "../holders/forward-ref-holder";
import { registerParameterDecorator } from "../holders/parameter-holder";
import { ProviderToken } from "../providers/provider.interface";
import { Type } from "../type";

/*
 * TODO:
 *  @ModuleRef
 *  @InjectorRef
 *  @AppRef
 */

export function Inject(token: ProviderToken): any {
    return function(target: Type, propertyKey: string, parameterIndex: number) {
        registerParameterDecorator(target, propertyKey || "constr", parameterIndex, "injectToken", token);
    }
}

export function FactoryRef(): any {
    return function(target: Type, propertyKey: string, parameterIndex: number) {
        registerParameterDecorator(target, propertyKey || "constr", parameterIndex, "factoryRef", true);
    }
}

export function Optional(): any {
    return function(target: Type, propertyKey: string, parameterIndex: number) {
        registerParameterDecorator(target, propertyKey || "constr", parameterIndex, "optional", true);
    }
}

export function ForwardRef(callback: ForwardRefFn) {
    return function(target: Type, propertyKey: string, parameterIndex: number) {
        registerForwardRef(target, propertyKey || "constr", parameterIndex, callback);
    }
}
