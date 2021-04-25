import { CommandParamTypes } from "./command-param-types";
import { CommandParamParserResult } from "./parsers/command-param-parser";
import { ScriptingParserDataHolder } from "./scripting-parser-data-holder";

export class CommandParamHolder {
    private constructor(
        public readonly typeData: { type: CommandParamTypes | string; array: boolean },
        private readonly dataHolder: ScriptingParserDataHolder,
    ) {
    }

    public static fromParameter(param: string, dataHolder: ScriptingParserDataHolder): CommandParamHolder {
        return new CommandParamHolder(CommandParamHolder.getType(param, dataHolder), dataHolder);
    }

    private static getType(parameter: string, dataHolder: ScriptingParserDataHolder): {
        readonly type: CommandParamTypes | string;
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
        console.warn(`Type ${match[1]} is missing from dataHolder`);
        switch (match[1].trim()) {
            case "n":
                return {
                    type : CommandParamTypes.NUMBER,
                    array: !!match[2],
                };
            case "i":
                return {
                    type : CommandParamTypes.INT,
                    array: !!match[2],
                };
            case "f":
                return {
                    type : CommandParamTypes.FLOAT,
                    array: !!match[2],
                };
            case "s":
                return {
                    type : CommandParamTypes.STRING,
                    array: !!match[2],
                };
            case "a2":
                return {
                    type : CommandParamTypes.POSITION_ABSOLUTE2,
                    array: !!match[2],
                };
            case "t":
                return {
                    type : CommandParamTypes.TIME,
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
