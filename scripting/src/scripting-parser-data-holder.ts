import { CommandParamTypes } from "./command-param-types";
import { CommandParamParser } from "./parsers/command-param-parser";

export class ScriptingParserDataHolder {
    private constructor(
        private readonly parserByType: { readonly [type in string]: CommandParamParser<unknown> },
        private readonly typeByPattern: { readonly [pattern in string]: CommandParamTypes | string },
    ) {
    }

    public static fromFlatArray(param: [CommandParamParser<unknown>, CommandParamTypes | string, string][]): ScriptingParserDataHolder {
        return ScriptingParserDataHolder.fromArray(param.map(([parser, type, pattern]) => ({parser, type, pattern})));
    }

    public static fromArray(param: { parser: CommandParamParser<unknown>, type: CommandParamTypes | string, pattern: string }[]): ScriptingParserDataHolder {
        const {parserByType, typeByPattern} = param.reduce((acc, curr) => ({
            parserByType : Object.assign(acc.parserByType, {[curr.type]: curr.parser}),
            typeByPattern: Object.assign(acc.typeByPattern, {[curr.pattern]: curr.type}),
        }), {parserByType: {}, typeByPattern: {}});

        return new ScriptingParserDataHolder(parserByType, typeByPattern);
    }

    public getParserByType<T>(type: CommandParamTypes | string): CommandParamParser<T> | null {
        return this.parserByType[type] as CommandParamParser<T>;
    }

    public getTypeByPattern(pattern: string): CommandParamTypes | string {
        return this.typeByPattern[pattern];
    }
}
