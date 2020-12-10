import { GLogger } from "gtools/GUtils";
import { Type } from "../type";
import { Provider, ProviderType } from "./provider.interface";

export interface TypeProvider<T = any> extends Provider<T> {
    readonly type: Type<T>;
    readonly wasCreated: boolean;
    readonly parameterTypes: any[];

    createInstance<T>(args?: any[]): T;
}

export function createTypeProvider<T>(token: ProviderType<T> & Type<T>): TypeProvider<T> {
    return new TypeProviderInstance(token);
}

class TypeProviderInstance<T> implements TypeProvider<T> {
    public readonly parameterTypes: any[] = Reflect.getMetadata('design:paramtypes', this.token);
    private wasConstructorCalled          = false;
    private readonly prototypeObject      = Object.create(this.token.prototype);

    public constructor(public readonly token: ProviderType<T> & Type<T>) {
    }

    public get type(): Type<T> {
        return this.token as Type<T>;
    }

    public get wasCreated(): boolean {
        return this.wasConstructorCalled;
    }

    public get instance(): T {
        return this.prototypeObject;
    }

    public createInstance<T>(args: any[] = []): T {
        if (this.wasConstructorCalled) {
            throw new Error("Cannot create instance multiple times");
        }

        GLogger.log("Calling constructor on " + this.token.name + " => " + JSON.stringify(this.prototypeObject), "TypeProviderInstance");

        this.token.apply(this.prototypeObject, args);
        this.wasConstructorCalled = true;

        return this.prototypeObject;
    }
}
