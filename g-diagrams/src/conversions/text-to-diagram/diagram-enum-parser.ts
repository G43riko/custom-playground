import { DiagramAccessModifier } from "../../class/common/diagram-access-modifier";
import { DiagramElementType } from "../../class/common/diagram-element-type";
import { DiagramType } from "../../class/common/diagram-type";
import { DiagramEntityFactory } from "../../class/diagram-entity-factory";
import { DiagramEntity } from "../../class/entity/diagram-entity";
import { DiagramProperty } from "../../class/property/diagram-property";
import { DiagramEntityParser } from "./diagram-entity-parser";

export class DiagramEnumParser extends DiagramEntityParser {


    public parseEnumBody(bodyActiveRows: string[], factory: DiagramEntityFactory<DiagramEntity>): void {
        bodyActiveRows.forEach((row) => {
            factory.addPropertyRaw(this.getParsedEnumProperty(row));
        });
    }

    /**
     * TODO: check if value is not number or boolean or object
     */
    private getParsedEnumProperty(content: string): DiagramProperty {
        const [data, value] = content.split("=");

        return {
            name       : data.trim(),
            type       : DiagramType.String,
            final      : true,
            static     : true,
            access     : DiagramAccessModifier.PUBLIC,
            optional   : false,
            value      : value?.trim(),
            elementType: DiagramElementType.PROPERTY,
        };
    }

}
