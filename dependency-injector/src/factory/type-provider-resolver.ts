import { GLogger } from "gtools/GUtils";
import { getForwardRef } from "../holders/forward-ref-holder";
import { getParameterDecorator } from "../holders/parameter-holder";
import { ProviderTokenToString, ProviderTypeToString } from "../providers/provider-utils";
import { ProviderToken } from "../providers/provider.interface";
import { TypeProvider } from "../providers/type-provider";
import { Type } from "../type";
import { FactoryInstance } from "./factory";
import { Factory } from "./factory.interface";

function tryResolveForwardRef<T>(token: ProviderToken<T>,
                                 index: number,
                                 factory: FactoryInstance): T | undefined {
    const forwardRef = getForwardRef(token, "constr", index);
    if (forwardRef) {
        const forwardRefHolder = factory.getProvider(forwardRef);
        if (forwardRefHolder) {
            GLogger.log("Forwarding dependency: " + forwardRef.name, "Factory");
            return forwardRefHolder.instance;
        }
    }
}

function tryResolveExplicitInject<T>(type: Type<T>,
                                     index: number,
                                     factory: FactoryInstance): T | undefined {
    const injectToken = getParameterDecorator(type, "constr", index, "injectToken");
    if (!injectToken) {
        return;
    }
    const dependencyForToken = factory.getDependency(injectToken);

    if (dependencyForToken) {
        return dependencyForToken;
    }

    const childHolder = factory.getProvider(injectToken);

    if (childHolder) {
        return resolveTypeProvider(factory, childHolder);
    }
}

function resolveParameter<T>(injectableHolder: TypeProvider<T>,
                             factory: FactoryInstance,
                             index: number,
                             token: ProviderToken): T | Factory {
    const dependency = factory.getDependency(token);
    if (dependency) {
        return dependency;
    }

    const holder = factory.getProvider(token);
    if (typeof holder === "undefined") {
        const injectToken = tryResolveExplicitInject(injectableHolder.type, index, factory);
        if (injectToken) {
            return injectToken;
        }

        const hasFactoryRefDecorator = getParameterDecorator(injectableHolder.type, "constr", index, "factoryRef");
        if (hasFactoryRefDecorator) {
            return factory;
        }

        const forwardRef = tryResolveForwardRef(injectableHolder.token, index, factory);
        if (forwardRef) {
            return forwardRef
        }
    }

    if (typeof holder !== "undefined") {
        return resolveTypeProvider(factory, holder);
    }


    const isOptional = getParameterDecorator(injectableHolder.type, "constr", index, "optional");
    if (isOptional) {
        return undefined as any;
    }

    GLogger.error("injectableHolder.parameterTypes: " + injectableHolder.parameterTypes.join(", "), "Factory");
    let order: string;
    if (index === 0) {
        order = "1st"
    } else if (index === 1) {
        order = "2nd"
    } else if (index === 2) {
        order = "3rd"
    } else {
        order = (index + 1) + "th";
    }
    throw new Error(`Cannot determine ${order} parameter (${ProviderTokenToString(token)}) for ${ProviderTypeToString(injectableHolder.type)}`);
}


export function resolveTypeProvider<T>(factory: FactoryInstance, injectableHolder: TypeProvider<T> | undefined): T {
    if (!injectableHolder) {
        throw new Error("Cannot get dependency for: " + injectableHolder)
    }
    GLogger.log("Resolving: " + ProviderTokenToString(injectableHolder.token), "Factory");

    // TODO: THIS SHOULD BE UNCOMMENT BUT IT THROWS ERROR IN ExampleBasicApp
    // if (injectableHolder.hasFinalInstance || Math.random() < 2) {
    if (injectableHolder.wasCreated) {
        return injectableHolder.instance;
    }

    if (!injectableHolder.parameterTypes) {
        return injectableHolder.createInstance();
    }
    const dependencies = injectableHolder.parameterTypes.map((token: ProviderToken, index: number) => resolveParameter(
        injectableHolder,
        factory,
        index,
        token,
    ));

    return injectableHolder.createInstance(dependencies);
}
