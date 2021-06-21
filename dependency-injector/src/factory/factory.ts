import {GLogger} from "gtools/GUtils";
import {CustomProvider, CustomProviderClass, isCustomProvider} from "..";
import {ProviderTokenToString, ProviderTypeToString} from "../providers/provider-utils";
import {ProviderToken, ProviderType} from "../providers/provider.interface";
import {createTypeProvider, TypeProvider} from "../providers/type-provider";
import {Type} from "../type";
import {DependencyRecord} from "./dependency-record";
import {DependencyTypeRecord} from "./dependency-type-record";
import {Factory} from "./factory.interface";
import {resolveTypeProvider} from "./type-provider-resolver";

export class FactoryInstance implements Factory {
    private resolved = false;
    private readonly typeRegistry: DependencyTypeRecord = new DependencyTypeRecord();
    private readonly customDependencyRegistry: DependencyRecord = new DependencyRecord();
    private readonly factories: Factory[] = [];

    public constructor(private readonly type: Type<any> | "static",
                       private readonly parent?: FactoryInstance) {
        GLogger.log(this + " was created", "Factory");
    }

    public require<T>(token: ProviderToken<T>): T {
        const result = this.getDependency(token);
        if (!result) {
            throw new Error("Cannot resolve dependency for token: " + ProviderTokenToString(token));
        }

        return result;
    }

    public toString(): string {
        return "FactoryInstance[" + (this.type === "static" ? this.type : this.type.name) + "]";
    }

    public getDependency<T>(token: ProviderToken<T>, defaultValue?: T, calledFromFactory?: Factory): T | undefined {
        GLogger.warn("Getting dependency using token " + ProviderTokenToString(token) + " from factory " + this, "Factory");
        if (!this.resolved) {
            GLogger.warn("Trying to get dependency using token " + ProviderTokenToString(token) + " from unresolved factory", "Factory");
        }

        // Then custom providers
        const customDependency = this.customDependencyRegistry.getDependency(token);
        if (customDependency) {
            return customDependency;
        }

        // Then my providers
        const typeDependency = this.typeRegistry.getDependency(token);
        if (typeDependency) {
            return typeDependency;
        }


        // Check factories first
        for (const factory of this.factories) {
            if (factory !== calledFromFactory) {
                const result = factory.getDependency(token, undefined, this);
                if (result) {
                    return result;
                }
            }
        }

        // Finally check parent providers
        if (this.parent && calledFromFactory !== this.parent) {
            return this.parent.getDependency(token, undefined, this);
        }

        return defaultValue;
    }

    public getProvider<T>(token: ProviderToken<T>): TypeProvider {
        if (!this.resolved) {
            GLogger.warn("Trying to get holder using token " + ProviderTokenToString(token) + " from unresolved factory", "Factory");
        }
        const result = this.typeRegistry.getHolder(token);
        if (!result) {
            if (this.parent) {
                return this.parent.getProvider(token);
            }
        }

        return result;
    }

    // TODO:
    //  - Need to verify that this is not called multiple times
    //  - Is this method necessary?
    public resolve(): void {
        if (this.resolved) {
            GLogger.warn("Trying to resolve factory multiple times", "Factory");

            return;
        }
        this.typeRegistry.forEach((injectableHolder) => {
            const result = resolveTypeProvider(this, injectableHolder);
            GLogger.log("Successfully created instance of " + ProviderTokenToString(injectableHolder.token) + ": " + result, "Factory");
        });
        this.resolved = true;
    }

    public register<T>(provider: Factory | ProviderType<T>): void {
        if (provider instanceof FactoryInstance) {
            this.factories.push(provider);
        } else {
            this.registerProvider(provider as ProviderType);
        }
    }

    private registerProvider<T>(provider: ProviderType<T>) {
        GLogger.log("registering provider: " + ProviderTypeToString(provider), "FactoryInstance");
        if (isCustomProvider(provider)) {
            this.registerCustomProvider(provider);
        } else {
            this.registerTypeProvider(provider);
        }
        this.resolved = false;
    }

    private registerTypeProvider<T>(provider: ProviderType<T> & Type<T>) {
        if (this.typeRegistry.has(provider)) {
            throw new Error("Cannot register provider multiple times");
        }
        this.typeRegistry.addProvider(createTypeProvider(provider));
    }

    private registerCustomProvider<T>(provider: ProviderType<T> & CustomProvider<T>) {
        if (this.customDependencyRegistry.has(provider.token)) {
            throw new Error("Cannot register provider multiple times");
        }
        this.customDependencyRegistry.addProvider(new CustomProviderClass(provider));
    }
}
