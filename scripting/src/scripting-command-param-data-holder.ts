import {ScriptingParamType} from "./scripting-param-type";
import {CommandParamParserResult} from "./parsers/command-param-parser";
import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";

export class ScriptingCommandParamDataHolder {
    private constructor(
        public readonly typeData: { type: ScriptingParamType | string; array: boolean },
        private readonly dataHolder: ScriptingParserDataProvider,
    ) {
    }

    public static fromParameter(param: string, dataHolder: ScriptingParserDataProvider): ScriptingCommandParamDataHolder {
        return new ScriptingCommandParamDataHolder(ScriptingCommandParamDataHolder.getType(param, dataHolder), dataHolder);
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

    public parse<T>(value: string): CommandParamParserResult<T[]> | null {
        if (!this.typeData.array) {
            return this.parseLocally(value);
        }

        const resultData: T[] = [];

        let result = this.parseLocally<T>(value);

        if (!result) {
            return null;
        }

        let lastValidRemains = result.remains;

        while (result) {
            resultData.push(result.result);
            lastValidRemains = result.remains;
            result           = this.parseLocally(result.remains);
        }

        return {
            remains: lastValidRemains,
            result : resultData,
        };
    }

    private parseLocally<T>(value: string): CommandParamParserResult<T> | null {
        const parser = this.dataHolder.getParserByType<T>(this.typeData.type);
        if (parser) {
            return parser.parse(value);
        }

        console.warn("Cannot resolve parser for type " + this);

        return null;
    }
}
