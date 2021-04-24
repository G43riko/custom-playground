import { CommandParamParser } from "./command-param-parser";

export class CommandNumberParser implements CommandParamParser<number> {
    public constructor(private isInteger = false) {
    }

    public parse(value: string): { remains: string, result: number } | null {
        if (!this.isInteger) {
            return this.parseLocally(value);
        }
        const parsedData = this.parseLocally(value);
        if (!parsedData || parsedData.result % 1 !== 0) {
            return null;
        }

        return parsedData;
    }

    public parseLocally(value: string): { remains: string, result: number } | null {
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
