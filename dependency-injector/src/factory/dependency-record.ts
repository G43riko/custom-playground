import { Provider, ProviderToken } from "../providers/provider.interface";

export class DependencyRecord<S extends Provider = Provider> {
    protected readonly dependencies: Map<ProviderToken, S> = new Map();

    public getDependency<T>(type: ProviderToken<T>): T | undefined {
        const moduleHolder = this.dependencies.get(type);

        if (!moduleHolder) {
            return;
        }


        return moduleHolder.instance
    }

    public has<T>(type: ProviderToken<T>): boolean {
        return this.dependencies.has(type);
    }

    public addProvider<T>(provider: S): void {
        this.dependencies.set(provider.token, provider)
    }
}
