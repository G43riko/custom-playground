import {DiagramType} from "../../class/common/diagram-type";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {DiagramEntity} from "../../class/entity/diagram-entity";
import {DiagramEntityType} from "../../class/entity/diagram-entity-type";

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func: (...args: unknown[]) => unknown): string[] {
    const fnStr = func.toString().replace(STRIP_COMMENTS, "");
    let result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];

    return result;
}

export class TypeParser {
    public parse(value: new (...params: any[]) => any): DiagramEntity {
        const propertyNames = Object.getOwnPropertyNames(value);
        const propertyDescriptors = Object.getOwnPropertyDescriptors(value);

        const factory = new DiagramEntityFactory<DiagramEntity>(DiagramEntityType.CLASS, value.name);

        propertyNames.forEach((propertyName) => {
            if (["length", "name", "prototype"].includes(propertyName)) {
                return;
            }
            const descriptor = Object.getOwnPropertyDescriptor(value, propertyName) as PropertyDescriptor;

            factory.addPropertyRaw({
                name: propertyName,
                value: descriptor.value,
                type: this.determineTypeFromValue(descriptor.value),
                defaultValue: descriptor.value,
                static: true,
            });
        });

        if (value.prototype?.constructor?.name === value.name) {
            Object.getOwnPropertyNames(value.prototype).forEach((propertyName) => {
                if (["constructor"].includes(propertyName)) {
                    return;
                }

                const method = value.prototype[propertyName];
                const parameters = method.length;

                const entire = method.toString();
                const body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
                const parameterNames = getParamNames(method);

                console.assert(parameterNames.length === parameters, `Cannot access all parameter names for function ${method}. Parameters: ${parameterNames.join(", ")}`);

                factory.addMethodRaw({
                    name: propertyName,
                    returnType: DiagramType.Unknown,
                    content: body,
                    parameters: parameterNames.map((name) => ({
                        name,
                        type: DiagramType.Unknown,
                    })),
                });
            });
        }

        return {
            propertyNames,
            propertyDescriptors,
            factory,
        } as any;
    }

    private determineTypeFromValue(value: any): DiagramType {
        if (typeof value === "string") {
            return DiagramType.String;
        }
        if (typeof value === "number") {
            return DiagramType.Number;
        }

        if (typeof value === "boolean") {
            return DiagramType.Boolean;
        }

        // TODO: check array, object, function, Date

        return DiagramType.Unknown;
    }
}
