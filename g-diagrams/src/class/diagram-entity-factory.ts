import {DiagramAccessModifier} from "./common/diagram-access-modifier";
import {DiagramElementType} from "./common/diagram-element-type";
import {DiagramGeneric} from "./common/diagram-generic";
import {DiagramType} from "./common/diagram-type";
import {DiagramClass} from "./entity/diagram-class";
import {DiagramEntity} from "./entity/diagram-entity";
import {DiagramEntityType} from "./entity/diagram-entity-type";
import {DiagramEnum} from "./entity/diagram-enum";
import {DiagramInterface} from "./entity/diagram-interface";
import {DiagramMethod} from "./method/diagram-method";
import {DiagramMethodParameter} from "./method/diagram-method-parameter";
import {DiagramProperty} from "./property/diagram-property";

const defaultAccess = DiagramAccessModifier.PUBLIC;

export class DiagramEntityFactory<T extends DiagramEntity> {
    private readonly properties: DiagramProperty[] = [];
    private readonly methods: DiagramMethod[] = [];
    private parentExtend?: DiagramType;
    private parentImplements: DiagramType[] = [];
    private readonly generics: DiagramGeneric[] = [];
    private access: DiagramAccessModifier = defaultAccess;
    private abstract = false;

    private constructor(
        private readonly type: DiagramEntityType,
        private readonly name: string,
    ) {
    }

    public static createClass(name: string): DiagramEntityFactory<DiagramClass> {
        return new DiagramEntityFactory(DiagramEntityType.CLASS, name);
    }

    public static createEnum(name: string): DiagramEntityFactory<DiagramEnum> {
        return new DiagramEntityFactory(DiagramEntityType.ENUM, name);
    }

    public static createInterface(name: string): DiagramEntityFactory<DiagramInterface> {
        return new DiagramEntityFactory(DiagramEntityType.INTERFACE, name);
    }

    public addPropertyRaw(property: Omit<DiagramProperty, "elementType">): this {
        this.properties.push(
            Object.assign(property, {elementType: DiagramElementType.PROPERTY}) as DiagramProperty,
        );

        return this;
    }

    public setParentExtends(parent: string): void {
        this.parentExtend = DiagramType.Link(parent);
    }

    public addParentImplements(parent: string): void {
        if (this.type !== DiagramEntityType.CLASS) {
            throw new Error("Only class cen implements objects");
        }
        this.parentImplements.push(DiagramType.Link(parent));
    }

    public addGenerics(...generics: DiagramGeneric[]): this {
        this.generics.push(...generics);

        return this;
    }

    public setAbstract(abstract: boolean): this {
        this.abstract = abstract;

        return this;
    }

    public addProperty(
        name: string,
        type: DiagramType,
        access: DiagramAccessModifier,
        options?: Pick<DiagramProperty, "static" | "final" | "optional" | "abstract" | "defaultValue">,
    ): this {
        return this.addPropertyRaw(
            Object.assign({}, options, {name, type, access}) as DiagramProperty,
        );
    }

    public addPrivateProperty(name: string, type: DiagramType, defaultValue?: string): this {
        return this.addProperty(name, type, DiagramAccessModifier.PRIVATE, {defaultValue} as any);
    }

    public addPublicProperty(name: string, type: DiagramType, defaultValue?: string): this {
        return this.addProperty(name, type, DiagramAccessModifier.PUBLIC, {defaultValue} as any);
    }

    public addPublicFinalProperty(name: string, type: DiagramType, defaultValue?: string): this {
        return this.addProperty(name, type, DiagramAccessModifier.PUBLIC, {defaultValue, final: true} as any);
    }

    public addMethodRaw(method: Omit<DiagramMethod, "elementType">): this {
        this.methods.push(
            Object.assign(method, {elementType: DiagramElementType.METHOD}) as DiagramMethod,
        );

        return this;
    }

    public addMethod(
        name: string,
        returnType: DiagramType,
        access: DiagramAccessModifier,
        parameters: DiagramMethodParameter[],
        options?: Pick<DiagramMethod, "static" | "final" | "optional" | "abstract">,
    ): this {
        return this.addMethodRaw(
            Object.assign({}, options, {name, access, returnType, parameters}) as unknown as DiagramMethod,
        );
    }

    public addPublicGenericMethod(name: string, returnType: DiagramType, generics: DiagramGeneric[], ...parameters: DiagramMethodParameter[]): this {
        return this.addMethodRaw({
            name,
            returnType,
            parameters,
            generics,
            access: DiagramAccessModifier.PUBLIC,
        });
    }

    public addPublicMethod(name: string, returnType: DiagramType, ...parameters: DiagramMethodParameter[]): this {
        return this.addMethod(name, returnType, DiagramAccessModifier.PUBLIC, parameters);
    }

    public addPrivateMethod(name: string, returnType: DiagramType, ...parameters: DiagramMethodParameter[]): this {
        return this.addMethod(name, returnType, DiagramAccessModifier.PRIVATE, parameters);
    }

    public build(): T {
        switch (this.type) {
            case DiagramEntityType.CLASS:
                return this.buildClass() as unknown as T;
            case DiagramEntityType.INTERFACE:
                return this.buildInterface() as unknown as T;
            case DiagramEntityType.ENUM:
                return this.buildEnum() as unknown as T;
            default:
                throw new Error("Cannot build entity with type " + this.type);
        }
    }

    private buildClass(): DiagramClass {
        return {
            elementType: DiagramElementType.ENTITY,
            name: this.name,
            access: this.access || defaultAccess,
            type: DiagramEntityType.CLASS,
            properties: this.properties,
            methods: this.methods,
            generics: this.generics,
            abstract: this.abstract,
            parentExtend: this.parentExtend,
            parentImplements: this.parentImplements,
        };
    }

    private buildEnum(): DiagramEnum {
        return {
            elementType: DiagramElementType.ENTITY,
            name: this.name,
            access: this.access || defaultAccess,
            type: DiagramEntityType.ENUM,
            properties: this.properties,
        };
    }

    private buildInterface(): DiagramInterface {
        return {
            elementType: DiagramElementType.ENTITY,
            name: this.name,
            access: this.access || defaultAccess,
            type: DiagramEntityType.INTERFACE,
            properties: this.properties,
            methods: this.methods,
            generics: this.generics,
            parentExtend: this.parentExtend,
        };
    }
}
