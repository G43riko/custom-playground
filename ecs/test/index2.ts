class Item {
    public getType(): string {
        return "C"
    }
}

function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) as any
            );
        });
    });
}

type System = { new(): { getName(): string } };
const data = new Map<string, System>()

export function DecA<T extends { new(...args: any[]): {}, readonly type: string }>(): (constructor: T) => any {
    return (constructor: T): T => {
        console.log("DecA", constructor.type);

        class DecA extends constructor {
            public getName(): string {
                return constructor.type
            }
        }

        data.set(constructor.type, DecA);

        return DecA;
    }
}

export function DecB<T extends { new(...args: any[]): {} }>(type: string): (constructor: T) => any {
    return (constructor: T): T => {
        class DecB extends constructor {
            public getName(): string {
                return type;
            }
        }

        data.set(type, DecB);

        return DecB
    }
}

export function DecC<T extends { new(...args: any[]): Item }>(): (constructor: T) => any {
    return (constructor: T): T => {
        console.log("DecD", constructor.prototype.getType());

        class DecC extends constructor {
            public getName(): string {
                return this.getType();
            }
        }

        data.set(constructor.prototype.getType(), DecC);

        return DecC;
    }
}

@DecA()
class A {
    public static readonly type = "A";
}

@DecB("B")
class B {
}

@DecC()
class C extends Item {
}


class Person {
    public constructor(private readonly name: string, private readonly age: number) {
    }
}

function createInstance<T, S extends { new(...args: any[]): T }>(type: S, ...params: ConstructorParameters<S>): T {
    return new type();
}

const personInstance = createInstance(Person, "name", 21);

const instA = new A();
const instB = new B();
const instC = new C();
const instD = new data[(instA as any).getName()]();
const instE = new B();
const instF = new C();
console.log(data);
console.log(instA, instB, instC);
console.log((instA as any).getName());
console.log((instB as any).getName())
console.log((instC as any).getName())
