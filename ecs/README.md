## Usage

```typescript
@EcsEntity()
class Person {
    public constructor(
        private readonly name: string,
        private readonly age: number,
    ) {
    }
}

@EcsEntity()
class Colored {
    public constructor(
        public readonly fillColor: string,
    ) {
    }
}

@EcsEntity({
    type: "RENDERABLE"
})
class Renderable {
    public constructor(
        private readonly position: SimpleVector2,
        private readonly size: SimpleVector2,
    ) {
    }
}
@EcsEntity({
    type: "INTERACTIVE"
})
class Interactive {
    public readonly interactive = true;
}




@EcsSystem({
    type: "PERSON_RENDER"
})
class PersonRenderSystem {
    @EcsFamily({
        require : [Person, Renderable],
        optional: [Colored],
    })
    private readonly personComponents: Family<Person & Renderable & Colored>;


    public update(delta: number): void {
        this.personComponents.forEach((entity: Entity<Person & Renderable & Colored>) => {
            const person: Person               = entity.getByType(Person.type);
            const renderable: Renderable       = entity.get(Renderable);
            const colored: Colored | undefined = entity.get(Colored);
            this.render(person, renderable, colored?.fillColor || "black");
        })
    }

    private render(person: Person, renderable: Renderable): void {
        // rendering
    }
}


@EcsSystem({
    type: "SOME_SYSTEM"
})
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
@EcsAnotherSystem({
    type: "SOME_ANOTHER_SYSTEM"
})
class SomeSystem {
    public constructor(private someAnotherParams: string) {
    }
}

///////////////////////////////////////////////////////////////////////

const gabriel = createEntity(
    Interactive,
    new Person("Gabriel", 27),
    createComponent(Colored, "green"),
    createComponent(Renderable, {x: 0, y: 0}, {x: 192, y: 30}),
)

const nikola = createEntity();
nikola.addComponent(Interactive);
nikola.addComponent(new Person("Nikola", 25));
nikola.addComponent(Colored, "pink");
nikola.addComponent(Renderable, {x: 35, y: 0}, {x: 165, y: 25});

const engine = new EcsEngine();
engine.addEntity(gabriel);
engine.addEntity(nikola);
engine.addSystem(PersonRenderSystem);
engine.addSystem(new SomeSystem("something"));
engine.addSystem(SomeAnotherSystem, "something");
```
