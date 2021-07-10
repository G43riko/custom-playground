import { DiagramAccessModifier } from "./common/diagram-access-modifier";
import { DiagramElementType } from "./common/diagram-element-type";
import { DiagramGeneric } from "./common/diagram-generic";
import { DiagramType } from "./common/diagram-type";
import { DiagramMethod } from "./method/diagram-method";
import { DiagramMethodParameter } from "./method/diagram-method-parameter";

const defaultAccess = DiagramAccessModifier.PUBLIC;

export class DiagramMethodFactory {
    private parameters: DiagramMethodParameter[] = [];
    private readonly generics: DiagramGeneric[]  = [];
    private abstract                             = false;

    public constructor(
        private readonly name: string,
        private readonly returnType           = DiagramType.Void,
        private access: DiagramAccessModifier = defaultAccess,
    ) {
    }

    public setAccess(access: DiagramAccessModifier): this {
        this.access = access;

        return this;
    }

    public setAbstract(value: boolean): this {
        this.abstract = value;

        return this;
    }

    public build(): DiagramMethod {
        return {
            access     : this.access,
            name       : this.name,
            returnType : this.returnType,
            abstract   : this.abstract,
            generics   : this.generics,
            parameters : this.parameters,
            elementType: DiagramElementType.METHOD,
        };
    }
}
