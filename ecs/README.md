## Usage

```typescript
@EcsComponent()
class Person {
    public constructor(
        private readonly name: string,
        private readonly age: number,
    ) {
    }
}

@EcsComponent()
class Colored {
    public constructor(
        public readonly fillColor: string,
    ) {
    }
}

@EcsComponent()
class Renderable {
    public constructor(
        private readonly position: SimpleVector2,
        private readonly size: SimpleVector2,
    ) {
    }
}

@EcsComponent()
class Interactive {
    public readonly interactive = true;
}


@EcsSystem()
class PersonRenderSystem {
    @EcsFamily({
        require : [Person, Renderable],
        optional: [Colored],
    })
    private readonly personComponents: Family<Person & Renderable & Colored>;


    public update(delta: number): void {
        this.personComponents.forEach((entity: Entity<Person & Renderable & Colored>) => {
            const person: Person               = entity.getComponent(Person);
            const renderable: Renderable       = entity.getComponent(Renderable);
            const colored: Colored | undefined = entity.getComponent(Colored);
            this.render(person, renderable, colored?.fillColor || "black");
        })
    }

    private render(person: Person, renderable: Renderable): void {
        // rendering
    }
}


@EcsSystem()
class SomeSystem {
    public onAddToEngine(engine: EscEngine): void {
        console.log("Added to engine: ", engine);
    }
    public onRemoveFromEngine(engine: EscEngine): void {
        console.log("Removed to engine: ", engine);
    }
    
    public constructor(private someParams: string) {
    }
}

@EcsSystem()
class SomeSystem {
    public constructor(private someAnotherParams: string) {
    }
}

///////////////////////////////////////////////////////////////////////

const gabriel = Ecs.createEntity(
    Interactive,
    new Person("Gabriel", 27),
    Ecs.createComponent(Colored, "green"),
    Ecs.createComponent(Renderable, {x: 0, y: 0}, {x: 192, y: 30}),
)

const nikola = Ecs.createEntity();
nikola.addComponent(Interactive);
nikola.addComponent(new Person("Nikola", 25));
nikola.addComponent(Colored, "pink");
nikola.addComponent(Renderable, {x: 35, y: 0}, {x: 165, y: 25});

const engine = new EcsEngine();
engine.addEntity(gabriel);
engine.addEntity(nikola);
engine.addSystem(PersonRenderSystem, 2);
engine.addSystem(new SomeSystem("something"), 0);
engine.addSystem(SomeAnotherSystem, "something", 1);
```

update in order: SomeSystem, SomeAnotherSystem, PersonRenderSystem

## TODO

- [ ] `optional` parameter in family can be multidimensional array
- [ ] add required systems in EcsSystem
- [ ] system can have async app_initializer method
- [x] add family in EcsSystem parameters

```typescript
@EcsSystem({
    family: {
        require : [Person, Renderable],
        optional: [Colored],
    }
})
export class MasSomeSystem {
    public processEntity(entity: EcsEntity, delta: number): void {

    }
}
```

- [ ] add sort options in EcsFamily

```typescript
@EcsSystem()
export class MasSomeSystem {
    @EcsFamily({
        require : [Person, Renderable],
        optional: [Colored],
    })
    private readonly personComponents: Family;

    public update(delta: number): void {

    }
}

```

- [ ] add interval parameter in EcsSystem

```typescript
@EcsSystem({
    interval: 1000
})
export class SomeSystem {

    public updateDelayed(msSinceLastUpdate: number): void {

    }
}
```

- [x] add required components in EcsComponent

```typescript
@EcsComponent()
export class ComponentA {
}

@EcsComponent({require: [ComponentA]})
export class ComponentB {
}

const entityA = Ecs.createEntity(ComponentA); // OK

const entityAB = Ecs.createEntity(ComponentA, ComponentB); // OK

const entityB = Ecs.createEntity(ComponentB); // throws error becouse ComponentA is required by ComponentB

```

- [ ] add alias property in EcsComponent;

```typescript
@EcsComponent({alias: "mass"})
export class MassComponent {
    public constructor(public readonly mass = 1) {
    }
}

@EcsSystem()
export class MassSystem {
    @Family({
        require: [MassComponent],
    })
    private readonly massComponents: EcsFamily<MassComponent>;

    public update(delta: number): void {
        this.massComponents.entitiesWrapped.forEach((entity: { mass: MassComponent }) => {
            console.log(entity.mass.mass);
        })
    }
}
```

- [ ] Allow providing system into another system

```typescript
@EcsSystem()
export class SystemA {
}

@EcsSystem()
export class SystemB {
    @EcsExternal(SystemA)
    private readonly systemA: SystemA;
}
```
