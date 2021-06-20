import {DiagramAccessModifier} from "../class/common/diagram-access-modifier";
import {DiagramEntityType} from "../class/entity/diagram-entity-type";

interface ElementAttributeData {
    id: string;
    name: string;
    accessor: DiagramAccessModifier;
    changeability: string;
    documentation: string;
    type: string;
    /**
     * ID of connected object
     */
    classifier: string;
    array: boolean;
}

interface ElementParameterData {
    id: string;
    documentation: string;
    accessor: DiagramAccessModifier;
    /**
     * ID of connected object
     */
    classifier: string;
    type: string | DiagramEntityType;
}

interface ElementOperationData {
    id: string;
    name: string;
    accessor: DiagramAccessModifier;
    parameters: ElementParameterData[];
    documentation: string;
    returnType: string;
    abstract: boolean;
    static: boolean;
}

interface ElementData {
    id: string;
    name: string;
    package: string;
    abstract: boolean;
    documentation: string;
    links: {
        targetId: string;
        type: string;
    }[];
    accessor: DiagramAccessModifier;
    type: string | DiagramEntityType;
    attributes: ElementAttributeData[];
    operations: ElementOperationData[];
}

interface PackageElementData extends ElementData {
    children: (ElementData | PackageElementData)[];
}

export class Uml25ToJson {
    public static async test(): Promise<void> {
        const content = await fetch("/assets/paint/voxel.xml").then((response) => response.text());

        const parser = new Uml25ToJson();

        console.log(parser.parse(content));
    }

    public parse(content: string): unknown {

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "text/xml");

        const objects = this.parseObjects(Array.from(xmlDoc.getElementsByTagName("element")).slice(0, 9900));

        return this.organizeObjects(objects);
    }

    private organizeObjects(elements: ElementData[]): PackageElementData {
        const packageMap = elements.filter((element) => element.type === "PACKAGE" || element.name === "ROOT")
            .map<PackageElementData>((pck) => ({...pck, children: []}))
            .reduce((acc, pck) => Object.assign(acc, {[pck.id]: pck}), {} as { [key in string]: PackageElementData });
        const rootElement = elements.find((element) => element.name === "ROOT");
        const rootObject = packageMap[rootElement.id] as PackageElementData;

        if (!rootObject) {
            throw new Error("Cannot find root object");
        }
        elements.forEach((element) => {
            const parentPackage = packageMap[element.package];
            if (!parentPackage) {
                return;
            }
            parentPackage.children.push(element.type === "PACKAGE" ? packageMap[element.id] : element);
        });

        return rootObject;
    }

    private parseAttributes(attributeElements: Element[]): ElementAttributeData[] {
        return attributeElements.map((element) => {
            const attribute: Partial<ElementAttributeData> = {
                name: element.getAttribute("name"),
                id: element.getAttribute("xmi:idref"),
                accessor: this.parseScope(element.getAttribute("scope")),
            };

            const documentation = element.getElementsByTagName("documentation")[0];
            if (documentation) {
                attribute.documentation = documentation.getAttribute("value");
            }

            const properties = element.getElementsByTagName("properties")[0];
            if (properties) {
                attribute.type = properties.getAttribute("type");
                attribute.changeability = properties.getAttribute("changeability");
                attribute.classifier = properties.getAttribute("classifier");
                attribute.array = Boolean(properties.getAttribute("collection"));
            }

            return attribute as ElementAttributeData;
        });
    }

    private parseParameters(parameterElements: Element[]): ElementParameterData[] {
        return parameterElements.map((element) => {
            const parameter: Partial<ElementParameterData> = {
                // name: element.getAttribute("name"),
                id: element.getAttribute("xmi:idref"),
                accessor: this.parseScope(element.getAttribute("scope")),
            };

            const documentation = element.getElementsByTagName("documentation")[0];
            if (documentation) {
                parameter.documentation = documentation.getAttribute("value");
            }

            const properties = element.getElementsByTagName("properties")[0];
            if (properties) {
                parameter.type = properties.getAttribute("type");
                parameter.type = properties.getAttribute("type");
                parameter.classifier = properties.getAttribute("classifier");
            }

            return parameter as ElementParameterData;
        });
    }

    private parseOperations(operationElements: Element[]): ElementOperationData[] {
        return operationElements.map((element) => {
            const operation: Partial<ElementOperationData> = {
                name: element.getAttribute("name"),
                id: element.getAttribute("xmi:idref"),
                accessor: this.parseScope(element.getAttribute("scope")),
                parameters: this.parseParameters(Array.from(element.getElementsByTagName("parameter")))
            };

            const documentation = element.getElementsByTagName("documentation")[0];
            if (documentation) {
                operation.documentation = documentation.getAttribute("value");
            }

            const type = element.getElementsByTagName("type")[0];
            if (type) {
                operation.returnType = type.getAttribute("type");
                operation.abstract = Boolean(type.getAttribute("isAbstract"));
                operation.static = Boolean(type.getAttribute("static"));
            }

            return operation as ElementOperationData;
        });
    }

    private parseScope(type: string): DiagramAccessModifier {
        switch (type) {
            case "Public":
                return DiagramAccessModifier.PUBLIC;
            case "Private":
                return DiagramAccessModifier.PRIVATE;
            case "Protected":
                return DiagramAccessModifier.PROTECTED;
        }
    }

    private parseObjects(elementNodeListOf: Element[]): ElementData[] {
        const parseXmlType = (type: string): string => {
            switch (type) {
                case "uml:Interface":
                case "Interface":
                    return DiagramEntityType.INTERFACE;
                case "uml:Class":
                case "Class":
                    return DiagramEntityType.CLASS;
                case "uml:Enumeration":
                case "Enumeration":
                    return DiagramEntityType.ENUM;
                case "uml:Package":
                case "Package":
                    return "PACKAGE";
                case "uml:ProvidedInterface":
                case "uml:RequiredInterface":
                case "uml:Component":
                case "uml:Port":
                case "uml:Actor":
                case "uml:UseCase":
                case "uml:State":
                case "uml:StateNode":
                case "uml:Signal":
                case "uml:Activity":
                case "uml:Event":
                case "uml:Note":
                case "uml:Decision":
                case "uml:Sequence":
                case "uml:DataType":
                case "uml:InteractionFragment":
                case "uml:PrimitiveType":
                case null:
                    return type;
                default:
                    console.warn("Unknown type ", type);

                    return type;
            }
        };

        const getName = (element: Element): string => {
            const nameAttribute = element.getAttribute("name");
            if (nameAttribute) {
                return nameAttribute;
            }

            if (element.hasAttribute("xmi:type") || element.hasAttribute("geometry")) {
                return "UNKNOWN";
            }

            return "ROOT";
        };

        const getConnectionTypeFrom = (type: string): string => {
            switch (type) {
                case "Aggregation":
                    return "aggregation";
                case "Generalization":
                    return "generalization";
                case "Realisation":
                    return "realisation";
                case "Sequence":
                    return "sequence";
                case "Usage":
                    return "usage";
                case "Association":
                    return "association";
                case "UseCase":
                    return "useCase";
                case "Assembly":
                    return "assembly";
                case "Dependency":
                    return "dependency";
                case "Delegate":
                    return "delegate";
                case "StateFlow":
                    return "stateFlow";
                case "ControlFlow":
                    return "controlFlow";
                case "NoteLink":
                    return "noteLink";
                default:
                    console.log("Unknown link type ", type);

                    return type;
            }
        };

        return elementNodeListOf.map((element) => {
            const id = element.getAttribute("xmi:idref");
            const result: Partial<ElementData> = {
                id,
                type: parseXmlType(element.getAttribute("xmi:type")),
                name: getName(element),
                accessor: this.parseScope(element.getAttribute("scope")),
                attributes: this.parseAttributes(Array.from(element.getElementsByTagName("attribute"))),
                operations: this.parseOperations(Array.from(element.getElementsByTagName("operation"))),
            };

            const documentation = element.getElementsByTagName("documentation")[0];
            if (documentation) {
                result.documentation = documentation.getAttribute("value");
            }

            const model = element.getElementsByTagName("model")[0];
            if (model) {
                result.package = model?.getAttribute("package");
            }

            const properties = element.getElementsByTagName("properties")[0];
            if (properties) {
                result.abstract = Boolean(properties.getAttribute("isAbstract"));
            }
            const links = element.getElementsByTagName("links")[0];
            if (links) {
                result.links = Array.from(links.children).map((link) => {
                    const start = link.getAttribute("start");
                    const end = link.getAttribute("end");

                    const targetId = start === id ? end : (end === id ? start : null);

                    if (!targetId) {
                        throw new Error("Cannot combine " + JSON.stringify({start, end, id}));
                    }

                    return {
                        targetId,
                        type: getConnectionTypeFrom(link.tagName),
                    };
                });
            }

            return result as ElementData;
        });
    }
}
