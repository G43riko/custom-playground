import {DiagramMethod} from "../class/method/diagram-method";
import {DiagramWorldContext} from "./diagram-world-context";
import {DiagramEntityContext} from "./diagram-entity-context";
import {
    DiagramContextValidationResult,
    DiagramContextValidationResultInstance,
} from "./diagram-context-validation-result";
import {DiagramGenericContextInstance} from "./diagram-generic-context";
import {DiagramGeneric} from "../class/common/diagram-generic";
import {DiagramType, DiagramTypeName} from "../class/common/diagram-type";

export class DiagramMethodContext extends DiagramGenericContextInstance {
    public constructor(private readonly method: DiagramMethod) {
        super();

        if (method.generics) {
            this.generics.push(...method.generics);
        }
    }

    /**
     * 1. validate return type
     * 2. validate each parameters
     *
     * TODO:
     *  - optional or default parameters cannot be placed before required ones
     *  - method generics are unique
     *  - parameters names are unique
     * @param worldContext
     * @param entityContext
     */
    public validate(worldContext: DiagramWorldContext, entityContext: DiagramEntityContext): DiagramContextValidationResult {
        const validationResult = new DiagramContextValidationResultInstance();
        const returnTypeValidationResult = this.canResolveType(this.method.returnType, worldContext, entityContext.generics);
        if (!returnTypeValidationResult) {
            validationResult.addError("Cannot determine return control (" + this.method.returnType.name + ") for method " + entityContext.entity.name + "." + this.method.name);
        }
        this.method.parameters?.forEach((parameter, index) => {
            const parameterValidationResult = this.canResolveType(
                parameter.type,
                worldContext,
                entityContext.generics,
            );

            if (!parameterValidationResult) {
                validationResult.addError("Cannot determine control (" + parameter.type.name + ") for " + index + " nth parameter of  " + entityContext.entity.name + "." + this.method.name + " named " + parameter.name);
            }
        });

        return validationResult.getResult();
    }

    private canResolveType(
        type: DiagramType,
        worldContext: DiagramWorldContext,
        classGenerics: DiagramGeneric[],
    ): boolean {
        const name = type.name === DiagramTypeName.LINK ? type.className : type.name;
        if (!name) {
            throw new Error("Cannot get name from type " + JSON.stringify(type));
        }

        // if it global name etc STRING, NUMBER...
        if (name in DiagramTypeName) {
            return true;
        }

        // class generics
        if (classGenerics.some((generic) => generic.name === name)) {
            return true;
        }

        // method generics
        if (this.generics.some((generic) => generic.name === name)) {
            return true;
        }

        // global classes
        if (worldContext.hasAnywhere(name)) {
            return true;
        }

        return false;
    }


}
