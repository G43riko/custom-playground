import { DiagramElementType } from "./class/common/diagram-element-type";
import { DiagramGeneric } from "./class/common/diagram-generic";
import { DiagramClass } from "./class/entity/diagram-class";
import { DiagramEntity } from "./class/entity/diagram-entity";
import { DiagramEntityType } from "./class/entity/diagram-entity-type";
import { DiagramEnum } from "./class/entity/diagram-enum";
import { DiagramInterface } from "./class/entity/diagram-interface";
import { DiagramMethod } from "./class/method/diagram-method";
import { DiagramProperty } from "./class/property/diagram-property";

export class DiagramCheckers {
    public static isProperty(item: any): item is DiagramProperty {
        return item.elementType === DiagramElementType.PROPERTY;
    }

    public static isMethod(item: any): item is DiagramMethod {
        return item.elementType === DiagramElementType.METHOD;
    }

    public static isEntity(item: any): item is DiagramEntity {
        return item.elementType === DiagramElementType.ENTITY;
    }

    public static isGeneric(item: any): item is DiagramGeneric {
        return item.elementType === DiagramElementType.GENERIC;
    }

    public static isClass(item: any): item is DiagramClass {
        return item.elementType === DiagramElementType.ENTITY && item.type === DiagramEntityType.CLASS;
    }

    public static isInterface(item: any): item is DiagramInterface {
        return item.elementType === DiagramElementType.ENTITY && item.type === DiagramEntityType.INTERFACE;
    }

    public static isEnum(item: any): item is DiagramEnum {
        return item.elementType === DiagramElementType.ENTITY && item.type === DiagramEntityType.ENUM;
    }
}
