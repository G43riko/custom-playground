import { DependencyParameters, Type } from "./dependency";

export function createDataFromParameters(parameters: DependencyParameters): DependencyData {
    return {
        purpose     : parameters.purpose,
        dependencies: parameters.require ?? []
    }
}

export interface DependencyData {
    purpose: string;
    dependencies: Type[];
}

class DependencyGraph {
    private readonly data: Map<Type, DependencyData> = new Map();

    public addItem(constructor: Type, parameters: DependencyParameters): void {
        this.data.set(constructor, createDataFromParameters(parameters));
    }

    public print(): void {
        console.log(this.data);
    }
}

export const DependencyData = new DependencyGraph();
