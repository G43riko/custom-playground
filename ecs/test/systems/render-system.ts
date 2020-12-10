import { EcsEntitySystem } from "../../src/ecs/ecs-entity-system";
import { EscFamilyBuilder } from "../../src/ecs/esc-family-builder";
import { RenderComponent } from "../components/render.component";

export class RenderSystem extends EcsEntitySystem {
    public readonly type   = "RENDER_SYSTEM";
    public readonly family = EscFamilyBuilder.create().addMustHave(RenderComponent.type)

    public update(delta: number): void {
        return undefined;
    }

}
