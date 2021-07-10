import { DiagramAccessModifier, DiagramAccessModifierToString } from "../class/common/diagram-access-modifier";
import { DiagramGeneric, DiagramGenericToString } from "../class/common/diagram-generic";
import { DiagramTypeToString } from "../class/common/diagram-type";
import { DiagramClass } from "../class/entity/diagram-class";
import { DiagramMethod } from "../class/method/diagram-method";
import { DiagramMethodParameter } from "../class/method/diagram-method-parameter";
import { DiagramProperty } from "../class/property/diagram-property";

const keyWords = {
    static  : "static",
    final   : "final", // const, readonly
    abstract: "abstract",
};


function getGenerics(generics: DiagramGeneric[]): string {
    if (!Array.isArray(generics)) {
        return "";
    }

    return `<${generics.map((e) => DiagramGenericToString(e)).join(", ")}>`;
}

function getDataFromProperty(param: DiagramProperty): string[] {
    const subData: string[] = [
        DiagramAccessModifierToString(param.access || DiagramAccessModifier.PUBLIC),
        param.static ? ` ${keyWords.static} ` : " ",
        param.final ? ` ${keyWords.final} ` : " ",
        param.abstract ? ` ${keyWords.abstract} ` : " ",
        param.name,
        param.optional ? "?" : "",
        ": ",
        DiagramTypeToString(param.type),
        param.defaultValue ? ` = ${param.defaultValue}` : "",
    ];

    return [subData.filter((e) => e).join("")];
}

function getDataFromParameter(param: DiagramMethodParameter): string {
    const subData: string[] = [
        param.name,
        param.optional ? "?" : "",
        ": ",
        DiagramTypeToString(param.type),
        param.defaultValue ? ` = ${param.defaultValue}` : "",
    ];

    return subData.filter((e) => e).join("");
}

function getDataFromMethod(param: DiagramMethod): string[] {
    const subData: string[] = [
        DiagramAccessModifierToString(param.access || DiagramAccessModifier.PUBLIC),
        param.static ? ` ${keyWords.static} ` : "",
        param.final ? ` ${keyWords.final} ` : " ",
        param.name,
        param.optional ? "?" : "",
        getGenerics(param.generics ?? []),
        "(",
        (param.parameters || []).map(getDataFromParameter).join(", "),
        ")",
        ": ",
        DiagramTypeToString(param.returnType),
    ];

    return [subData.filter((e) => e).join("")];
}

export function getDataFromClass(param: DiagramClass): { titles: string[], data: string[][] } {
    const data: string[][] = [];
    const title: string    = [
        DiagramAccessModifierToString(param.access || DiagramAccessModifier.PUBLIC),
        param.abstract ? keyWords.abstract : "",
        param.final ? keyWords.final : "",
        param.name,
        getGenerics(param.generics ?? []),
    ].filter((e) => e).join(" ");

    data.push(...param.properties.map((prop) => getDataFromProperty(prop)));
    data.push(...param.methods.map((meth) => getDataFromMethod(meth)));

    return {data, titles: [title]};
}
