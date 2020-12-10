import { EcsComponent } from "./ecs-component";
import { EcsFamily } from "./ecs-family";
import { EcsStatefulFamily } from "./ecs-stateful-family";

export class EscFamilyBuilder {
    private readonly mustHave: EcsComponent["type"][]  = [];
    private readonly oneOff: EcsComponent["type"][]    = [];
    private readonly exclusive: EcsComponent["type"][] = [];

    private constructor() {
    }

    public static create(): EscFamilyBuilder {
        return new EscFamilyBuilder();
    }

    public addMustHaveType(...types: EcsComponent["type"][]): this {
        this.mustHave.push(...types);

        return this;
    }

    public addMustHave(...types: EcsComponent["type"][]): this {
        this.mustHave.push(...types);

        return this;
    }

    public addOneOff(...types: EcsComponent["type"][]): this {
        this.oneOff.push(...types);

        return this;
    }

    public addExclusive(...types: EcsComponent["type"][]): this {
        this.exclusive.push(...types);

        return this;
    }

    public build(): EcsFamily {
        return new EcsFamily(this.mustHave, this.oneOff, this.exclusive);
    }

    public buildStateful(): EcsStatefulFamily {
        return new EcsStatefulFamily(this.mustHave, this.oneOff, this.exclusive);
    }
}
