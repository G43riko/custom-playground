import { EcsEngine } from "../src/ecs/ecs-engine";
import { EcsEntity } from "../src/ecs/ecs-entity";
import { RenderComponent } from "./components/render.component";
import { VisibilityComponent } from "./components/visibility.component";
import { MoveSystem } from "./systems/move-system";
import { RenderSystem } from "./systems/render-system";

const engine = new EcsEngine();


engine.addSystem(new RenderSystem());
engine.addSystem(new MoveSystem());

const entity = new EcsEntity();

entity.addComponentType(RenderComponent);
entity.addComponentType(VisibilityComponent);
entity.addComponent(new VisibilityComponent());

engine.addEntity(entity);

type ParamInstanceA = ({ readonly type: string } & Item);
type ParamTypeA = (new () => ParamInstanceA);
type ParamType = ParamInstanceA | ParamTypeA;

const decoratorA = <T extends { new(...args: any[]): {}, readonly type: string }>(constructor: T): T => {
    return class extends constructor {
        public readonly type = constructor.type;
    };
}

class Item {
    public show(): void {
        console.log(this);
    }
}

class A extends Item {
    public static readonly type = "A";
}

class B extends Item {
    public readonly type = "B";
}


function processAllTypes(type: ParamType): void {

}


processAllTypes(A);
processAllTypes(new A());
processAllTypes(B);
processAllTypes(new B());
