export function isType(v: any): v is Type<any> {
    return typeof v === 'function';
}

export interface Type<T = object> {
    name?: string;

    new(...args: any[]): T;
}
