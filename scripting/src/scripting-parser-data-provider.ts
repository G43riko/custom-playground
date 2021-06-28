import {ScriptingParamType} from "./scripting-param-type";
import {CommandParamParser} from "./parsers/command-param-parser";

export class ScriptingParserDataProvider {
    private constructor(
        private readonly parserByType: { readonly [type in string]: CommandParamParser<unknown> },
        private readonly typeByPattern: { readonly [pattern in string]: ScriptingParamType | string },
    ) {
    }

    /**
     * @example
     * ScriptingParserDataHolder.fromFlatArray([
     *    [new CommandNumberParser(), ScriptingParamTypes.NUMBER, "n"],
     *    [new CommandNumberParser(), ScriptingParamTypes.FLOAT, "f"],
     *    [new CommandNumberParser(true), ScriptingParamTypes.INT, "i"],
     * ])
     */
    public static fromFlatArray(param: [CommandParamParser<unknown>, ScriptingParamType | string, string][]): ScriptingParserDataProvider {
        const {parserByType, typeByPattern} = param.reduce((acc, [parser, type, pattern]) => ({
            parserByType: Object.assign(acc.parserByType, {[type]: parser}),
            typeByPattern: Object.assign(acc.typeByPattern, {[pattern]: type.trim()}),
        }), {parserByType: {}, typeByPattern: {}});

        return new ScriptingParserDataProvider(parserByType, typeByPattern);
    }

    public getParserByType<T>(type: ScriptingParamType | string): CommandParamParser<T> | null {
        return this.parserByType[type] as CommandParamParser<T>;
    }

    public getTypeByPattern(pattern: string): ScriptingParamType | string {
        return this.typeByPattern[pattern];
    }
}
