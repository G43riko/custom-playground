import {DiagramType, DiagramTypeNames} from "../class/common/diagram-type";
import {DiagramContextInstance} from "./diagram-context";
import {DiagramEntityContext} from "./diagram-entity-context";
import {
    DiagramContextValidationResult,
    DiagramContextValidationResultInstance
} from "./diagram-context-validation-result";
import {DiagramEntity} from "../class/entity/diagram-entity";
import {DiagramMethod} from "../class/method/diagram-method";
import {DiagramProperty} from "../class/property/diagram-property";
import {DiagramCheckers} from "../diagram-checkers";

export class DiagramWorldContext extends DiagramContextInstance {
    private readonly entitiesContextMap = new Map<string, DiagramEntityContext>();
    private readonly customTypes: DiagramType[] = [];

    public addItem(value: DiagramEntity | DiagramMethod | DiagramProperty): void {
        super.addItem(value);

        if (DiagramCheckers.isEntity(value)) {
            this.entitiesContextMap.set(value.name, new DiagramEntityContext(value));
        }
    }

    /**
     * check if world context contains object with name given as parameter
     * @param name - searched name
     */
    public hasAnywhere(name: string): boolean {
        // search name in global objects
        const parentResult = this.has(name);
        if (parentResult) {
            return true;
        }

        // search in custom defined types
        if (this.customTypes.some((type) => {
            // if it is link, it is required to compare target object name
            if (type.name === DiagramTypeNames.LINK && type.className === name) {
                return true;
            }

            return type.name === name;
        })) {
            return true;
        }

        // Check if any child context provides searched name
        // TODO: is this really required? This should probably only check if type is not one of child entities
        for (const context of Array.from(this.entitiesContextMap.values())) {
            if (context.hasPublic(name)) {
                return true;
            }
        }

        return false;
    }

    public validate(): DiagramContextValidationResult {
        const validationResult = new DiagramContextValidationResultInstance();

        this.items.forEach((item) => {
            if (DiagramCheckers.isEntity(item)) {
                const entityContext = this.entitiesContextMap.get(item.name);
                if (!entityContext) {
                    throw new Error("Cannot find context for entity " + item);
                }
                const entityValidationResult = entityContext.validate(this);
                validationResult.addValidationResult(entityValidationResult);
            } else if (DiagramCheckers.isProperty(item)) {
                const canResolve = this.canResolveType(item.type);
                if (!canResolve) {
                    validationResult.addError(`Cannot resolve global variable '${item.name}'`);
                }
            }
        });

        return validationResult.getResult();
    }

    /**
     * Add custom defined types to world context
     * @param customTypes - array of custom types
     */
    public defineTypes(...customTypes: DiagramType[]): void {
        this.customTypes.push(...customTypes);
    }

    /**
     * @param type
     * @private
     */
    private canResolveType(
        type: DiagramType,
    ): boolean {
        const name = type.name === DiagramTypeNames.LINK ? type.className : type.name;
        if (!name) {
            throw new Error("Cannot get name from type " + JSON.stringify(type));
        }

        // if it global name etc STRING, NUMBER...
        if (name in DiagramTypeNames) {
            return true;
        }

        // global classes
        if (this.hasAnywhere(name)) {
            return true;
        }

        return false;
    }
}
