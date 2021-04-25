import { CommandParamParser, CommandParamParserResult } from "./command-param-parser";

export class CommandNumberParser implements CommandParamParser<number> {
    public constructor(private readonly isInteger = false) {
    }

    public parse(value: string): CommandParamParserResult<number> | null {
        if (!this.isInteger) {
            return this.parseLocally(value);
        }
        const parsedData = this.parseLocally(value);
        if (!parsedData || parsedData.result % 1 !== 0) {
            return null;
        }

        return parsedData;
    }

    private parseLocally(value: string): CommandParamParserResult<number> | null {
        const result = parseFloat(value);

        if (isNaN(result)) {
            return null;
        }

        return {
            result,
            remains: value.split(String(result))[1],
        };
    }
}
