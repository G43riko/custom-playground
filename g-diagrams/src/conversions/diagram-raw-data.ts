import { DiagramAccessModifier } from "../class/common/diagram-access-modifier";
import { DiagramEntityType } from "../class/entity/diagram-entity-type";

interface DiagramRawDataPackage {
    readonly name: string;
    readonly children: readonly DiagramRawDataPackage[];
}

interface DiagramRawDataGenerics {
    readonly name: string;
    readonly extends?: string;
    readonly defaultValue?: string;
}

type DiagramRawEntityId = string;
type DiagramRawEntityType = string;

export interface DiagramRawData {
    readonly model: {
        readonly packages: readonly DiagramRawDataPackage[];
        readonly entities: readonly {
            readonly id: DiagramRawEntityId;
            readonly name: string;
            readonly type: DiagramEntityType;
            readonly extends?: DiagramRawEntityId[];
            readonly implements?: DiagramRawEntityId[];
            readonly generics?: DiagramRawDataGenerics[];
            readonly properties?: {
                readonly access?: DiagramAccessModifier;
                readonly name: string;
                readonly type: DiagramRawEntityType;
                readonly defaultValue?: string;
                readonly optional?: boolean;
                readonly static?: boolean;
                readonly final?: boolean;
                readonly abstract?: boolean;
            }[];
            readonly methods?: {
                readonly access?: DiagramAccessModifier;
                readonly name: string;
                readonly returnType?: DiagramRawEntityType;
                readonly generics?: DiagramRawDataGenerics[];
                readonly properties: {
                    readonly name: string;
                    readonly type: DiagramRawEntityType;
                    readonly defaultValue?: string;
                    readonly optional?: boolean;
                }[];
                readonly static?: boolean;
                readonly final?: boolean;
                readonly abstract?: boolean;
            }[];
        }[];
    };
    readonly diagrams: readonly {
        readonly name: string;
        readonly type: "class";
        readonly entities: readonly {
            readonly entityId: DiagramRawEntityId;
            readonly position: {
                readonly x: number;
                readonly y: number;
            };
            readonly size: {
                readonly x: number;
                readonly y: number;
            };
        }[];
    }[];
}
