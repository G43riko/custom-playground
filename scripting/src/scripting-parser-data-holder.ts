import { CommandParamTypes } from "./command-param-types";
import { CommandParamParser } from "./parsers/command-param-parser";

export class ScriptingParserDataHolder {
    private constructor(
        private readonly parserByType: { readonly [type in string]: CommandParamParser },
        private readonly typeByPattern: { readonly [pattern in string]: CommandParamTypes | string },
    ) {
    }

    public static fromFlatArray(param: [CommandParamParser, CommandParamTypes | string, string][]): ScriptingParserDataHolder {
        return ScriptingParserDataHolder.fromArray(param.map(([parser, type, pattern]) => ({parser, type, pattern})));
    }

    public static fromArray(param: { parser: CommandParamParser, type: CommandParamTypes | string, pattern: string }[]): ScriptingParserDataHolder {
        const {parserByType, typeByPattern} = param.reduce((acc, curr) => ({
            parserByType : Object.assign(acc.parserByType, {[curr.type]: curr.parser}),
            typeByPattern: Object.assign(acc.typeByPattern, {[curr.pattern]: curr.type}),
        }), {parserByType: {}, typeByPattern: {}});

        return new ScriptingParserDataHolder(parserByType, typeByPattern);
    }

    public getParserByType(type: CommandParamTypes | string): CommandParamParser | null {
        return this.parserByType[type];
    }

    public getTypeByPattern(pattern: string): CommandParamTypes | string {
        return this.typeByPattern[pattern];
    }
}
