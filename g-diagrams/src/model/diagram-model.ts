import {DiagramGeneric} from "../class/common/diagram-generic";
import {DiagramType} from "../class/common/diagram-type";
import {DiagramClass} from "../class/entity/diagram-class";
import {DiagramEntity} from "../class/entity/diagram-entity";
import {DiagramWorldContext} from "../context/diagram-world-context";
import {DiagramContextValidationResult} from "../context/diagram-context-validation-result";

export class DiagramModel {
    private readonly entityMap = new Map<DiagramEntity["name"], DiagramEntity>();
    private readonly entitiesNames: DiagramEntity["name"][] = [];
    private readonly customTypes: DiagramType[] = [];

    /**
     * @param diagramClass - {@link DiagramClass} to inspect
     * @returns all types used in {@link DiagramClass}
     */
    public static getAllRequiredTypesOf(diagramClass: DiagramClass): DiagramType[] {
        const result: DiagramType[] = diagramClass.properties.map((property) => property.type);

        const addGenerics = (generics: DiagramGeneric[]) => {
            generics.forEach((generic) => {
                if (generic.extends) {
                    result.push(generic.extends);
                }
            });
        };

        // tslint:disable-next-line:no-for-each-push
        diagramClass.methods.forEach((method) => {
            result.push(method.returnType);

            result.push(
                ...(method.parameters?.map((parameter) => parameter.type) ?? []),
            );

            if (method.generics) {
                addGenerics(method.generics);
            }
        });

        if (diagramClass.generics) {
            addGenerics(diagramClass.generics);
        }

        return result;
    }

    public defineType(type: DiagramType): void {
        this.customTypes.push(type);
    }

    public addEntity<T extends DiagramEntity>(entity: T): T {
        if (this.entityMap.has(entity.name)) {
            throw new Error("Entity with name already exists");
        }
        this.entitiesNames.push(entity.name);
        this.entityMap.set(entity.name, entity);

        return entity;
    }

    public validate(): DiagramContextValidationResult {
        const worldContext = new DiagramWorldContext();
        // add all custom types to world context;
        worldContext.defineTypes(...this.customTypes);

        // create and add to world context for each entity
        this.entitiesNames.forEach((entityName) => {
            const entity = this.entityMap.get(entityName);
            if (entity) {
                worldContext.addItem(entity);
            }
        });

        return worldContext.validate();
    }
}
