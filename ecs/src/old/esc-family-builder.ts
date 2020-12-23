import { EcsComponent } from "./ecs-component";
import { EcsFamily } from "./ecs-family";
import { EcsStatefulFamily } from "./ecs-stateful-family";

export class EscFamilyBuilder<T extends EcsComponent["type"] = EcsComponent["type"]> {
    private readonly mustHave: T[]  = [];
    private readonly oneOff: T[]    = [];
    private readonly exclusive: T[] = [];

    private constructor() {
    }

    public static create(): EscFamilyBuilder {
        return new EscFamilyBuilder();
    }

    public addMustHaveType(...types: T[]): this {
        this.mustHave.push(...types);

        return this;
    }

    public addMustHave(...types: T[]): this {
        this.mustHave.push(...types);

        return this;
    }

    public addOneOff(...types: T[]): this {
        this.oneOff.push(...types);

        return this;
    }

    public addExclusive(...types: T[]): this {
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
