import { DiagramType } from "../common/diagram-type";

export interface DiagramMethodParameter {
    readonly index?: number;
    readonly name: string;
    readonly type: DiagramType;
    readonly defaultValue?: string;
    readonly optional?: boolean;
}
