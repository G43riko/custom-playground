import {ScriptingParamType} from "./scripting-param-type";
import {ScriptingCommandParamParser} from "./parsers/scripting-command-param-parser";
import {ScriptingCommandParamValidator} from "./scripting-command-param-validator";

export class ScriptingParserDataProvider {
    private constructor(
        private readonly parserByType: { readonly [type in string]: ScriptingCommandParamParser<unknown> },
        private readonly typeByPattern: { readonly [pattern in string]: ScriptingParamType | string },
        private readonly validatorByType: { readonly [type in string]: ScriptingCommandParamValidator<unknown> },
    ) {
    }

    /**
     * @example
     * ScriptingParserDataHolder.fromFlatArray([
     *    [new CommandNumberParser(), ScriptingParamType.NUMBER, "n"],
     *    [new CommandNumberParser(), ScriptingParamType.FLOAT, "f"],
     *    [new CommandNumberParser(true), ScriptingParamType.INT, "i"],
     *    [new CommandNumberParser(true), ScriptingParamType.INT_P, "d", ScriptingCommandParamValidator.min(0)],
     * ])
     */
    public static fromFlatArray(param: [ScriptingCommandParamParser<unknown>, ScriptingParamType | string, string, ScriptingCommandParamValidator<unknown>?][]): ScriptingParserDataProvider {
        const {
            parserByType,
            typeByPattern,
            validatorByType
        } = param.reduce((acc, [parser, type, pattern, validator]) => ({
            parserByType: Object.assign(acc.parserByType, {[type]: parser}),
            typeByPattern: Object.assign(acc.typeByPattern, {[pattern]: type.trim()}),
            validatorByType: Object.assign(acc.validatorByType, {[type]: validator}),
        }), {parserByType: {}, typeByPattern: {}, validatorByType: {}});

        return new ScriptingParserDataProvider(parserByType, typeByPattern, validatorByType);
    }

    public getParserByType<T>(type: ScriptingParamType | string): ScriptingCommandParamParser<T> | null {
        return this.parserByType[type] as ScriptingCommandParamParser<T>;
    }

    public getValidatorByType<T>(type: ScriptingParamType | string): ScriptingCommandParamValidator<T> | null {
        return this.validatorByType[type] as ScriptingCommandParamValidator<T>;
    }

    public getTypeByPattern(pattern: string): ScriptingParamType | string {
        return this.typeByPattern[pattern];
    }
}
