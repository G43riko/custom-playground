export interface EcsComponent {
    readonly type: string;
}

export type EcsComponentType = { new(...args: any[]): {}, readonly type: string }

export function EcsComponent<T extends EcsComponentType>(): (constructor: T) => any {
    return (constructor: T): T => {
        return class extends constructor {
            public readonly type = constructor.type;
        };
    }
}
