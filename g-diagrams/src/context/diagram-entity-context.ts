import {DiagramAccessModifier} from "../class/common/diagram-access-modifier";
import {DiagramType, DiagramTypeName} from "../class/common/diagram-type";
import {DiagramEntity} from "../class/entity/diagram-entity";
import {DiagramCheckers} from "../diagram-checkers";
import {DiagramWorldContext} from "./diagram-world-context";
import {
    DiagramContextValidationResult,
    DiagramContextValidationResultInstance,
} from "./diagram-context-validation-result";
import {DiagramGenericContextInstance} from "./diagram-generic-context";
import {DiagramMethodContext} from "./diagram-method-context";
import {DiagramMethod} from "../class/method/diagram-method";
import {DiagramProperty} from "../class/property/diagram-property";
import {DiagramEntityType} from "../class/entity/diagram-entity-type";

export class DiagramEntityContext extends DiagramGenericContextInstance {
    private readonly childContextMap = new Map<string, DiagramMethodContext | DiagramEntityContext>();

    public constructor(public readonly entity: DiagramEntity) {
        super();

        this.addItem(entity);

        if (DiagramCheckers.isClass(entity)) {
            entity.methods.forEach((method) => this.addItem(method));
            entity.properties.forEach((property) => this.addItem(property));
            if (entity.generics) {
                this.generics.push(...entity.generics);
            }
        } else if (DiagramCheckers.isInterface(entity)) {
            entity.methods.forEach((method) => this.addItem(method));
            entity.properties.forEach((property) => this.addItem(property));
            if (entity.generics) {
                this.generics.push(...entity.generics);
            }
        } else if (DiagramCheckers.isEnum(entity)) {
            entity.properties.forEach((property) => this.addItem(property));
        } else {
            throw new Error("Cannot create entityContext from " + entity);
        }
    }

    public addItem(value: DiagramEntity | DiagramMethod | DiagramProperty): void {
        super.addItem(value);
        if (DiagramCheckers.isMethod(value)) {
            this.childContextMap.set(value.name, new DiagramMethodContext(value));
        } else if (DiagramCheckers.isEntity(value)) {
            // we need to prevent add itself multiple times
            if (value.name === this.entity.name) {
                return;
            }

            this.childContextMap.set(value.name, new DiagramEntityContext(value));
        }
    }

    /**
     * return true if this context contains object with given name accessible from outside
     * @param name - searched name
     */
    public hasPublic(name: string): boolean {
        const value = this.items.get(name);
        if (!value) {
            return false;
        }

        return value.access === DiagramAccessModifier.PUBLIC;
    }

    /**
     * Validate this context against world context given as parameter
     *
     * @param worldContext - parent world context
     */
    public validate(worldContext: DiagramWorldContext): DiagramContextValidationResult {
        const validationResult = new DiagramContextValidationResultInstance();

        // check extends
        if (this.entity.parentExtend) {
            const canResolveExtends = this.canResolveType(this.entity.parentExtend, worldContext);

            if (!canResolveExtends) {
                validationResult.addError("Cannot resolve extends type (" + JSON.stringify(this.entity.parentExtend) + ") for entity " + this.entity.name);
            }
        }

        // check implements
        if (Array.isArray(this.entity.parentImplements)) {
            if (this.entity.type !== DiagramEntityType.CLASS) {
                validationResult.addError("Only classes can implements objects");
            }
            this.entity.parentImplements.forEach((impl) => {
                const canResolveImplements = this.canResolveType(impl, worldContext);

                if (!canResolveImplements) {
                    validationResult.addError("Cannot resolve implements type (" + JSON.stringify(impl) + ") for entity " + this.entity.name);
                }
            });
        }

        // check items
        this.items.forEach((value) => {
            if (value === this.entity) {
                return;
            }

            // TODO: validate nested entities;
            if (DiagramCheckers.isProperty(value)) {
                const result = this.canResolveType(value.type, worldContext);
                if (!result) {
                    validationResult.addError("Cannot resolve type (" + JSON.stringify(value.type) + ") for property " + this.entity.name + "." + value.name);
                }
            } else if (DiagramCheckers.isMethod(value)) {
                const methodContext = this.childContextMap.get(value.name);
                if (!methodContext) {
                    throw new Error("Cannot find context for method " + value.name);
                }
                validationResult.addValidationResult(methodContext.validate(worldContext, this));
            } else {
                validationResult.addError("Validation for " + JSON.stringify(value) + " is not implemented");
            }
        });

        return validationResult.getResult();
    }

    /**
     * @param type
     * @param worldContext
     * @private
     */
    private canResolveType(
        type: DiagramType,
        worldContext: DiagramWorldContext,
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
        if (this.generics.some((generic) => generic.name === name)) {
            return true;
        }

        // properties, methods or subclasses
        if (this.has(name)) {
            return true;
        }

        // global classes
        if (worldContext.hasAnywhere(name)) {
            return true;
        }

        return false;
    }
}
