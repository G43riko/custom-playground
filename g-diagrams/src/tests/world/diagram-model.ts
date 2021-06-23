enum DiagramAccessModifier {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    PRIVATE = "PRIVATE",
    PACKAGE = "PACKAGE",
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
    public parseEntityBasic(content: string);
}

//--
class DiagramClassParser extends DiagramEntityParser implements DiagramMethodParser {

}

//--
class DiagramEnumParser extends DiagramEntityParser {

}