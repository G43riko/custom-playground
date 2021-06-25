import {DiagramAccessModifier} from "../../class/common/diagram-access-modifier";

export interface ClassDiagramParserOptions {
    readonly errorOnUnknownType: boolean;
    readonly generateLinksFromExtends: boolean;
    readonly generateLinksFromInterfaces: boolean;
    readonly generateAllLinks: boolean;
    readonly listOfGlobalTypes: string[];
    readonly prefixAccessorMap: { [key in DiagramAccessModifier]?: string };
    readonly defaultAccessModifier: DiagramAccessModifier;
    readonly entityDivider: string;
}
