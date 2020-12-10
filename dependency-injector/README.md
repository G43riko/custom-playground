## Api

### Decorators

#### Injectable

Annotates class as injectable service. Check [example](#injectable)

#### Module

Annotates class as module

- providers
    - list of all providers provided in this module
- imports
    - Modules to be imported in this module

Check [module example](#module) or [module hierarchy example](#module-hierarchy)

#### FactoryRef

Provide factory instance as this parameter

#### ForwardRef

Used to resolve circular dependencies. Check [example](#forward-ref)

#### Inject

Inject annotate a parameter as with token

- Token

Check [custom providers example](#custom-providers)

#### Optional

Prevent to throw error when dependency cannot be resolves

### Classes

#### Factory

Is created by calling `createStaticFactory` or  `createModuleFactory`

##### Methods

###### `get<T>(token: Token<T>, defaultValue?: T) => T | undefined`

###### `require<T>(token: Token<T>) => T`

## Todo

- [ ] add deps to factory provider
- [ ] rename `factory` to `useFactory`
- [ ] rename `getDependency` to `get` in factory

## Examples

### Static factory

```typescript

@Injectable()
export class ServiceA {
}


@Injectable()
class ServiceB {
    public constructor(public readonly serviceA: ServiceA) {
    }
}

@Injectable()
class ServiceC {
    public constructor(public readonly serviceA: ServiceA,
                       public readonly serviceB: ServiceB) {
    }
}

const factory = createStaticFactory([ServiceA, ServiceB, ServiceC]);

const serviceA = factory.require(ServiceA);
const serviceB = factory.require(ServiceB);
const serviceC = factory.require(ServiceC);
```

#### Module

```typescript
@Injectable()
export class ServiceA {
}

@Injectable()
class ServiceB {
    public constructor(public readonly serviceA: ServiceA) {
    }
}

@Module({
    providers: [
        ServiceA,
        ServiceB,
    ]
})
class ModuleA {
    public constructor(public readonly serviceA: ServiceA,
                       public readonly serviceB: ServiceB) {
    }
}

const factory = geteModuleFactory(ModuleA);

const serviceA = factory.require(ServiceA);
const serviceB = factory.require(ServiceB);
const moduleA  = factory.require(ModuleA);
```

#### Module hierarchy

```typescript
@Injectable()
export class ServiceA {
}


@Module({
    providers: [
        ServiceA,
    ]
})
class ModuleA {
    public constructor(public readonly serviceA: ServiceA) {
    }
}


@Injectable()
class ServiceB {
    public constructor(public readonly serviceA: ServiceA) {
    }
}

@Module({
    providers: [
        ServiceB,
    ],
    imports  : [
        ModuleA,
    ]
})
class ModuleB {
    public constructor(public readonly serviceA: ServiceA,
                       public readonly serviceB: ServiceB) {
    }
}


const factoryA = createModuleFactory(ModuleA);

const moduleAserviceA = factoryA.get(ServiceA); // instance of ServiceA
const moduleAserviceB = factoryA.get(ServiceB); // undefined
const moduleAmoduleA  = factoryA.get(ModuleA); // instance of ModuleA

const factoryB = createModuleFactory(ModuleB);

const moduleBserviceA = factoryB.get(ServiceA); // instance of ServiceA
const moduleBserviceB = factoryB.get(ServiceB); // instance of ServiceB
const moduleBmoduleA  = factoryB.get(ModuleA); // instance of ModuleA

/*
 * moduleAserviceA === moduleBserviceA
 * moduleAserviceB !== moduleBserviceB
 * moduleAmoduleA === moduleBmoduleA
 */
```

#### Custom providers

```typescript
import { createStaticFactory } from "./factory-creators";


class NameService {
    public getGivenName(): string {
    };

    public getFamilyName(): string {
    };
}

class BirthdayService {
    public getDay(): number {
    };

    public getMonth(): number {
    };

    public getYear(): number {
    };
}

@Injectable()
class ServiceA {
    public constructor(@Inject("name") public readonly name: NameService,
                       @Inject("gender") public readonly gender: "MAN" | "WOMAN",
                       public readonly birthdayService: BirthdayService) {
    }
}

const factoryA = createStaticFactory([
    ServiceA,
    {
        provide : "name",
        useClass: NameService
    },
    {
        provide  : "gender",
        userValue: "MAN"
    },
    {
        provide: BirthdayService,
        factory: () => new BirthdayService(),
    }
])

```

#### Forward ref

```typescript
@Injectable()
export class ServiceA {
    public constructor(@ForwardRef(() => ServiceB) public readonly serviceB: ServiceB) {
    }
}


@Injectable()
class ServiceB {
    public constructor(public readonly serviceA: ServiceA) {
    }
}

const factory = createStaticFactory([ServiceA, ServiceB])

const serviceA = factory.require(ServiceA);
const serviceB = factory.require(ServiceB);

/*
 * serviceA.serviceB === serviceB
 * serviceB.serviceA === serviceA
 */

```
