// @ts-nocheck

enum DiagramAccessModifier {
    PUBLIC    = "PUBLIC",
    PROTECTED = "PROTECTED",
    PRIVATE   = "PRIVATE",
    PACKAGE   = "PACKAGE",
}

//--
type DiagramType = string;

//--
interface DiagramProperty {
    readonly name: string;
    readonly type: DiagramType;
    readonly accessor: DiagramAccessModifier;
}

//--
interface DiagramMethodParameter {
    readonly name: string;
    readonly type: DiagramType;
}

//--
interface DiagramMethod {
    readonly parameters: DiagramMethodParameter[];
    readonly name: string;
    readonly returnType: DiagramType;
    readonly accessor: DiagramAccessModifier;
}

//--
interface DiagramEntity {
    readonly properties: DiagramProperty[];
    readonly accessor: DiagramAccessModifier;
}

//--
interface DiagramClass extends DiagramEntity {
    readonly methods: DiagramMethod[];

}

//--
interface DiagramParserOptions {
    readonly errorOnUnknownType: boolean;
    readonly listOfGlobalTypes: string[];
    readonly prefixAccessorMap;
    readonly defaultAccessModifier: DiagramAccessModifier;
    readonly entityDivider: string;
}

//--
interface DiagramMethodParser {
    parseMethod(): void;
}

//--
abstract class DiagramAbstractParser {
    protected readonly options: DiagramParserOptions;
}

//--
class DiagramParser extends DiagramAbstractParser {

}

//--
class DiagramEntityParser extends DiagramAbstractParser {
    public parseEntityBasic(content: string): DiagramEntity;
}

//--
class DiagramClassParser extends DiagramEntityParser implements DiagramMethodParser {

}

//--
class DiagramEnumParser extends DiagramEntityParser {

}

//--
interface DiagramContextValidationResult {

}

//--
class DiagramContext {

}

//--
class DiagramWorldContext extends DiagramContext {
    public addProperty(property: DiagramProperty): void;

    public addMethod(method: DiagramMethod): void;

    public addEntity(entity: DiagramEntity): void;

    public defineTypes(customTypes: DiagramType[]): void

    public validate(): DiagramContextValidationResult;
}

//--
class DiagramEntityContext extends DiagramContext {
    public hasPublic(name: string): boolean

    public validate(worldContext: DiagramWorldContext): DiagramContextValidationResult
}

//--
class DiagramGenericContextInstance extends DiagramContext {
    public validate(worldContext: DiagramWorldContext, entityContext: DiagramEntityContext): DiagramContextValidationResult
}
