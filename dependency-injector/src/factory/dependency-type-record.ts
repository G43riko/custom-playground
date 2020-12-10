import { ProviderToken } from "../providers/provider.interface";
import { TypeProvider } from "../providers/type-provider";
import { DependencyRecord } from "./dependency-record";


export class DependencyTypeRecord extends DependencyRecord<TypeProvider> {
    public getHolder<T>(type: ProviderToken<T>): TypeProvider<T> {
        return this.dependencies.get(type) as TypeProvider<T>;
    }

    public getDependency<T>(type: ProviderToken<T>): T | undefined {
        const moduleHolder = this.dependencies.get(type);

        if (!moduleHolder) {
            return;
        }


        return moduleHolder.instance
    }

    public forEach(callback: (holder: TypeProvider) => void): void {
        this.dependencies.forEach(callback);
    }
}
