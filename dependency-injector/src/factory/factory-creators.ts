import { AppOptions, ModuleOptions } from "..";
import { getModuleHolderData } from "../holders/module-holder";
import { ProviderToken, ProviderType } from "../providers/provider.interface";
import { Type } from "../type";
import { FactoryInstance } from "./factory";
import { Factory } from "./factory.interface";

export function createStaticFactory(providers: ProviderType[]): Factory {
    const factory = new FactoryInstance("static");

    if (Array.isArray(providers)) {
        providers.forEach((provider) => factory.register(provider));
    }
    factory.resolve();
    return factory;
}


function createModuleFactory<T>(type: Type<T>, options: ModuleOptions, parent?: Factory): Factory {
    const parentFactory = parent as FactoryInstance;
    const factory       = new FactoryInstance(type, parentFactory);


    if (Array.isArray(options.imports)) {
        options.imports.forEach((importItem) => {
            factory.register(getModuleFactory(importItem));
            // factory.register(importItem);
        })
    }

    if (Array.isArray(options.providers)) {
        options.providers.forEach((provider) => factory.register(provider));
    }

    if (parentFactory) {
        parentFactory.register(factory);
    }

    factory.register(type);
    factory.resolve();

    return factory;
}


export function getModuleFactory<T>(token: ProviderToken<T>, parent?: Factory): Factory {
    const moduleData = getModuleHolderData(token);
    return createModuleFactory(moduleData.module, moduleData.options, parent);
}

export function createAppFactory(type: Type, options: AppOptions): Factory {
    const appFactory = new FactoryInstance(type);

    // GLOBAL PROVIDERS
    if (Array.isArray(options.providers)) {
        options.providers.forEach((provider) => appFactory.register(provider));
    }

    // MODULES
    if (Array.isArray(options.modules)) {
        options.modules.forEach((module) => {
            const factory = getModuleFactory(module, appFactory);
            appFactory.register(factory);
        });
    }

    appFactory.register(type);
    appFactory.resolve();

    return appFactory;
}
