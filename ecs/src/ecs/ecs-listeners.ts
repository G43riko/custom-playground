export interface EcsEntityListener<T> {
    entityAdded(entity: T): void;

    entityRemoved(entity: T): void;
}

export interface EcsEntitySystemListener<T> {
    systemAdded(system: T): void;

    systemRemoved(system: T): void;
}
