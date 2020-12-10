import { Provider, ProviderToken, ProviderType } from "./provider.interface";

export interface CustomProvider<T = any> {
    token: ProviderToken;
    useValue?: T,
    useClass?: T,
    factory?: () => T;
}

export function isCustomProvider(param: ProviderType): param is CustomProvider {
    const type = typeof (param as any).token;
    return type === "string" || type === "function";
}


function checkCustomProvider(customProvider: CustomProvider): void {
    if (!customProvider.factory && !customProvider.useClass && !customProvider.useValue) {
        throw new Error("Custom provider must have one of factory, useClass, useValue")
    }
}

export class CustomProviderClass<T> implements Provider<T> {
    public readonly token: ProviderToken;

    public constructor(private readonly provider: CustomProvider<T>) {
        this.token = provider.token
        checkCustomProvider(provider);
    }

    public get instance(): any {
        if (this.provider.useValue) {
            return this.provider.useValue;
        }

        if (typeof this.provider.useClass === "function") {
            return new (this.provider.useClass as any)();
        }

        if (typeof this.provider.factory === "function") {
            return this.provider.factory();
        }
    }
}
