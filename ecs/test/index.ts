import { SimpleVector2 } from "gtools/GUtils";
import { EcsComponent } from "../src/ecs/ecs-component";
import { EcsEngine } from "../src/ecs/ecs-engine";
import { EcsFamily, Family } from "../src/ecs/ecs-family";
import { Ecs } from "../src/ecs/ecs-holder";
import { EcsSystem } from "../src/ecs/ecs-system";

@EcsComponent()
class Person {
    public constructor(
        private readonly name: string,
        private readonly age: number,
    ) {
    }
}

@EcsComponent()
class TmpComponent {
}


@EcsComponent()
class Colored {
    public constructor(
        public readonly fillColor: string,
    ) {
    }
}

@EcsComponent({
    alias: "RENDERABLE",
})
class Renderable {
    public constructor(
        private readonly position: SimpleVector2,
        private readonly size: SimpleVector2,
    ) {
    }
}

@EcsComponent({
    alias: "INTERACTIVE",
})
class Interactive {
    public readonly interactive = true;
}

@EcsSystem({
    family: {
        required: [Person, Renderable],
        optional: [Colored],
    },
})
class PersonRenderSystem implements EcsSystem {
    @Family({
        required: [Person, Renderable],
        optional: [Colored],
    })
    // @ts-ignore
    public readonly personComponents: EcsFamily<Person & Renderable & Colored>;


    public onAddToEngine(engine: EcsEngine): void {
        // console.log("Added to engine: ", engine);
    }

    public onRemoveFromEngine(engine: EcsEngine): void {
        // console.log("Removed from engine: ", engine);
    }

    public update(delta: number): void {

    }
}

const gabriel = Ecs.createEntity(
    Ecs.createComponent(Interactive),
    Ecs.createComponent(Person, "Gabriel", 27),
    Ecs.createComponent(Colored, "green"),
    Ecs.createComponent(Renderable, {x: 0, y: 0}, {x: 192, y: 30}),
);
console.assert(gabriel.getComponent(Interactive) instanceof Interactive);
console.assert(gabriel.getComponent(Person) instanceof Person);
console.assert(gabriel.getComponent(Colored) instanceof Colored);
console.assert(gabriel.getComponent(Renderable) instanceof Renderable);

const nikola = Ecs.createEntity();
nikola.add(Interactive);
nikola.add(new Person("Nikola", 25));
nikola.add(Colored, "pink");
nikola.add(Renderable, {x: 35, y: 0}, {x: 165, y: 25});


const engine = new EcsEngine();
console.assert(engine.entitiesLength === 0, "No entities are in engine");
console.assert(engine.systemsLength === 0, "No systems are in engine");

engine.addEntity(gabriel);

console.assert(engine.entitiesLength === 1, "No entities are in engine");
console.assert(engine.systemsLength === 0, "No systems are in engine");
console.assert(!engine.getSystem(PersonRenderSystem), "System doesn't exist");

engine.addSystem(Ecs.createSystemInstance(PersonRenderSystem));

const personRenderSystem = engine.getSystem(PersonRenderSystem)!;
console.assert((personRenderSystem as any).engine, "Engine exists");
console.assert((personRenderSystem as any).engine === engine, "Engine is same as global");
console.assert(engine.entitiesLength === 1, "No entities are in engine");
console.assert(engine.systemsLength === 1, "No systems are in engine");
console.assert(personRenderSystem, "System exists");
console.assert(personRenderSystem.personComponents.entities.length === 1, "Wrong number of family entities 1");
console.assert((personRenderSystem as any).family.entities.length === 1, "Wrong number of family entities 1");

engine.addEntity(nikola);

console.assert(engine.entitiesLength === 2, "No entities are in engine");
console.assert(engine.systemsLength === 1, "No systems are in engine");
console.assert(personRenderSystem.personComponents.entities.length === 2, "Wrong number of family entities 2");
console.assert((personRenderSystem as any).family.entities.length === 2, "Wrong number of family entities 2");

engine.removeEntity(nikola);

console.assert(personRenderSystem.personComponents.entities.length === 1, "Wrong number of family entities 1");
console.assert((personRenderSystem as any).family.entities.length === 1, "Wrong number of family entities 1");
console.assert(engine.entitiesLength === 1, "No entities are in engine");
console.assert(engine.systemsLength === 1, "No systems are in engine");

engine.removeSystem(PersonRenderSystem);

console.assert(!(personRenderSystem as any).engine, "Engine doesn't exists");

console.assert(engine.entitiesLength === 1, "No entities are in engine");
console.assert(engine.systemsLength === 0, "No systems are in engine");

console.log("Before clean: " + Ecs);
Ecs.cleanUp();
console.log("After clean: " + Ecs);
