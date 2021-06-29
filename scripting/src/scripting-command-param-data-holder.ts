import {ScriptingParamType} from "./scripting-param-type";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";
import {ScriptingCommandParamParserSubResult} from "./parsers/scripting-command-param-parser-sub-result";
import {ScriptingCommandParamValidator} from "./scripting-command-param-validator";
import {ScriptingCommandParamParser} from "./parsers/scripting-command-param-parser";
import {ScriptingValidatorResult} from "./scripting-validator-result";

export class ScriptingCommandParamDataHolder<T = unknown> {
    private constructor(
        public readonly typeData: { type: ScriptingParamType | string; array: boolean },
        // TODO: this parameter should be passed as parameter with
        private readonly parser: ScriptingCommandParamParser<T>,
        private readonly validator?: ScriptingCommandParamValidator<T>,
    ) {
    }

    public static fromParameter<T>(param: string, dataHolder: ScriptingParserDataProvider): ScriptingCommandParamDataHolder<T> {
        const type = ScriptingCommandParamDataHolder.getType(param, dataHolder);
        const parser = dataHolder.getParserByType<T>(type.type);

        if (!parser) {

            throw new Error("Cannot resolve parser for type " + this);
        }

        return new ScriptingCommandParamDataHolder<T>(
            type,
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
            throw new Error("Parameter is not in valid format: `{.+}`");
        }

        const type = dataHolder.getTypeByPattern(match[1].trim());
        if (type) {
            return {
                type, array: !!match[2],
            };
        }
        console.warn(`Type '${match[1]}' is missing from dataHolder`);
        switch (match[1].trim()) {
            case "n":
                return {
                    type: ScriptingParamType.NUMBER,
                    array: !!match[2],
                };
            case "i":
                return {
                    type: ScriptingParamType.INT,
                    array: !!match[2],
                };
            case "f":
                return {
                    type: ScriptingParamType.FLOAT,
                    array: !!match[2],
                };
            case "s":
                return {
                    type: ScriptingParamType.STRING,
                    array: !!match[2],
                };
            case "a2":
                return {
                    type: ScriptingParamType.POSITION_ABSOLUTE2,
                    array: !!match[2],
                };
            case "t":
                return {
                    type: ScriptingParamType.TIME,
                    array: !!match[2],
                };
        }
        throw new Error("Unsupported type " + match[1].trim());
    }

    public toString(): string {
        return this.typeData.type + (this.typeData.array ? "[]" : "");
    }

    public async validate(value: T): Promise<ScriptingValidatorResult> {
        if (!this.validator) {
            return null;
        }

        return await this.validator.validate(value);
    }

    public parse(value: string): ScriptingCommandParamParserSubResult<T[]> | null {
        if (!this.typeData.array) {
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


export class ScriptingCommandParamDataHolderStateless {
    private constructor(
        public readonly typeData: { type: ScriptingParamType | string; array: boolean },
    ) {
    }

    public static fromParameter(param: string, dataHolder: ScriptingParserDataProvider): ScriptingCommandParamDataHolderStateless {
        return new ScriptingCommandParamDataHolderStateless(ScriptingCommandParamDataHolderStateless.getType(param, dataHolder));
    }

    private static getType(parameter: string, dataHolder: ScriptingParserDataProvider): {
        readonly type: ScriptingParamType | string;
        readonly array: boolean;
    } {
        const match = parameter.match(/{\W*(\w+) *(\[])?}/);
        if (!match) {
            throw new Error("Parameter is not in valid format: `{.+}`");
        }

        const type = dataHolder.getTypeByPattern(match[1].trim());
        if (type) {
            return {
                type, array: !!match[2],
            };
        }
        console.warn(`Type '${match[1]}' is missing from dataHolder`);
        switch (match[1].trim()) {
            case "n":
                return {
                    type: ScriptingParamType.NUMBER,
                    array: !!match[2],
                };
            case "i":
                return {
                    type: ScriptingParamType.INT,
                    array: !!match[2],
                };
            case "f":
                return {
                    type: ScriptingParamType.FLOAT,
                    array: !!match[2],
                };
            case "s":
                return {
                    type: ScriptingParamType.STRING,
                    array: !!match[2],
                };
            case "a2":
                return {
                    type: ScriptingParamType.POSITION_ABSOLUTE2,
                    array: !!match[2],
                };
            case "t":
                return {
                    type: ScriptingParamType.TIME,
                    array: !!match[2],
                };
        }
        throw new Error("Unsupported type " + match[1].trim());
    }

    public toString(): string {
        return this.typeData.type + (this.typeData.array ? "[]" : "");
    }

    public parse<T>(value: string, dataHolder: ScriptingParserDataProvider): ScriptingCommandParamParserSubResult<T[]> | null {
        if (!this.typeData.array) {
            return this.parseLocally(value, dataHolder);
        }

        const resultData: T[] = [];

        let result = this.parseLocally<T>(value, dataHolder);

        if (!result) {
            return null;
        }

        let lastValidRemains = result.remains;

        while (result) {
            resultData.push(result.result);
            lastValidRemains = result.remains;
            result = this.parseLocally(result.remains, dataHolder);
        }

        return {
            remains: lastValidRemains,
            result: resultData,
        };
    }

    private parseLocally<T>(value: string, dataHolder: ScriptingParserDataProvider): ScriptingCommandParamParserSubResult<T> | null {
        const parser = dataHolder.getParserByType<T>(this.typeData.type);
        if (parser) {
            return parser.parse(value);
        }

        console.warn("Cannot resolve parser for type " + this);

        return null;
    }
}
