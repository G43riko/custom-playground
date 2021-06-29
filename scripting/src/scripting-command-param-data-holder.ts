import {ScriptingParamType} from "./scripting-param-type";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";
import {ScriptingCommandParamParserSubResult} from "./parsers/scripting-command-param-parser-sub-result";
import {ScriptingCommandParamValidator} from "./scripting-command-param-validator";
import {ScriptingCommandParamParser} from "./parsers/scripting-command-param-parser";
import {ScriptingValidatorResult} from "./scripting-validator-result";

export class ScriptingCommandParamDataHolder<T = unknown> {
    private constructor(
        public readonly type: ScriptingParamType | string,
        public readonly array: boolean,
        private readonly parser: ScriptingCommandParamParser<T>,
        private readonly validator?: ScriptingCommandParamValidator<T>,
    ) {
    }

    public static fromParameter<T>(parameter: string, dataHolder: ScriptingParserDataProvider): ScriptingCommandParamDataHolder<T> {
        const type = ScriptingCommandParamDataHolder.getType(parameter, dataHolder);
        const parser = dataHolder.getParserByType<T>(type.type);

        if (!parser) {
            throw new Error("Cannot resolve parser for type " + this);
        }

        return new ScriptingCommandParamDataHolder<T>(
            type.type,
            type.array,
            parser,
            dataHolder.getValidatorByType<T>(type.type) ?? undefined,
        );
    }

    private static getType(parameter: string, dataHolder: ScriptingParserDataProvider): {
        readonly type: ScriptingParamType | string;
        readonly array: boolean;
    } {
        const match = parameter.match(/{\W*(\w+) *(\[])?}/);
        if (!match) {
            throw new Error("Parameter template is not in valid format: `{.+}`");
        }

        const type = dataHolder.getTypeByPattern(match[1].trim());
        if (type) {
            return {type, array: !!match[2]};
        }
        throw new Error(`Unsupported type ${match[1].trim()}`);
    }

    public toString(): string {
        return this.type + (this.array ? "[]" : "");
    }

    public async validate(value: T): Promise<ScriptingValidatorResult> {
        if (!this.validator) {
            return null;
        }

        return await this.validator.validate(value);
    }

    public parse(value: string): ScriptingCommandParamParserSubResult<T[]> | null {
        if (!this.array) {
            return this.parser.parse(value) as any;
        }

        const resultData: T[] = [];

        let result = this.parser.parse(value);

        if (!result) {
            return null;
        }

        let lastValidRemains = result.remains;

        while (result) {
            resultData.push(result.result);
            lastValidRemains = result.remains;
            result = this.parser.parse(result.remains);
        }

        return {
            remains: lastValidRemains,
            result: resultData,
        };
    }
}
