import { DependencyData } from "./dependency-graph";

export interface Type<T = any> {
    new(...args: any[]): T;
}

export interface DependencyParameters {
    purpose: string,
    require?: Type[]
}

export function Dependency<T extends { new(...args: any[]): {} }>(parameters: DependencyParameters): (constructor: T) => any {
    return (constructor: T): T => {
        DependencyData.addItem(constructor, parameters);

        return constructor;
        // return class extends constructor {};
    }
}
