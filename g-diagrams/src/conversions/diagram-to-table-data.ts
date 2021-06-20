import {DiagramAccessModifier} from "../class/common/diagram-access-modifier";
import {DiagramGeneric} from "../class/common/diagram-generic";
import {DiagramType} from "../class/common/diagram-type";
import {DiagramClass} from "../class/entity/diagram-class";
import {DiagramMethod} from "../class/method/diagram-method";
import {DiagramMethodParameter} from "../class/method/diagram-method-parameter";
import {DiagramProperty} from "../class/property/diagram-property";

const accessModifierSigns = {
    [DiagramAccessModifier.PRIVATE]: "-",
    [DiagramAccessModifier.PUBLIC]: "+",
    [DiagramAccessModifier.PROTECTED]: "/",
};

const keyWords = {
    static: "static",
    final: "final", // const, readonly
    abstract: "abstract",
};

function getDataFromType(param: DiagramType): string {
    if (Array.isArray(param.enumValues)) {
        return param.enumValues.join(" | ");
    }

    return [
        param.name,
        param.array ? "[]" : "",
    ].filter((e) => e).join("");
}

function getGeneric(generic: DiagramGeneric): string {
    return [
        generic.name,
        generic.extends ? `extends ${getDataFromType(generic.extends)}` : "",
        generic.defaultValue ? `= ${getDataFromType(generic.defaultValue)}` : "",
    ].filter((e) => e).join(" ");
}

function getGenerics(generics: DiagramGeneric[]): string {
    if (!Array.isArray(generics)) {
        return "";
    }

    return `<${generics.map(getGeneric).join(", ")}>`;
}

function getDataFromProperty(param: DiagramProperty): string[] {
    const subData: string[] = [
        accessModifierSigns[param.access || DiagramAccessModifier.PUBLIC],
        param.static ? ` ${keyWords.static} ` : " ",
        param.final ? ` ${keyWords.final} ` : " ",
        param.abstract ? ` ${keyWords.abstract} ` : " ",
        param.name,
        param.optional ? "?" : "",
        ": ",
        getDataFromType(param.type),
        param.defaultValue ? ` = ${param.defaultValue}` : "",
    ];

    return [subData.filter((e) => e).join("")];
}

function getDataFromParameter(param: DiagramMethodParameter): string {
    const subData: string[] = [
        param.name,
        param.optional ? "?" : "",
        ": ",
        getDataFromType(param.type),
        param.defaultValue ? ` = ${param.defaultValue}` : "",
    ];

    return subData.filter((e) => e).join("");
}

function getDataFromMethod(param: DiagramMethod): string[] {
    const subData: string[] = [
        accessModifierSigns[param.access || DiagramAccessModifier.PUBLIC],
        param.static ? ` ${keyWords.static} ` : "",
        param.final ? ` ${keyWords.final} ` : " ",
        param.name,
        param.optional ? "?" : "",
        getGenerics(param.generics),
        "(",
        (param.parameters || []).map(getDataFromParameter).join(", "),
        ")",
        ": ",
        getDataFromType(param.returnType),
    ];

    return [subData.filter((e) => e).join("")];
}

export function getDataFromClass(param: DiagramClass): { titles: string[], data: string[][] } {
    const data: string[][] = [];
    const title: string = [
        accessModifierSigns[param.access || DiagramAccessModifier.PUBLIC],
        param.abstract ? keyWords.abstract : "",
        param.final ? keyWords.final : "",
        param.name,
        getGenerics(param.generics),
    ].filter((e) => e).join(" ");

    data.push(...param.properties.map(getDataFromProperty));
    data.push(...param.methods.map(getDataFromMethod));

    return {data, titles: [title]};
}
