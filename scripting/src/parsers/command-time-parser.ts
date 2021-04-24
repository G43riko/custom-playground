import { CommandNumberParser } from "./command-number-parser";
import { CommandParamParser } from "./command-param-parser";

export class CommandTimeParser<T extends string> implements CommandParamParser<{ unit: T, duration: number }> {
    private readonly numberParser = new CommandNumberParser();
    private readonly unitPattern  = new RegExp("^(" + this.allowedUnits.join("|") + ")$", "i")

    public constructor(private readonly allowedUnits = ["MS", "S", "M", "H"] as T[]) {
    }

    public parse(value: string): { remains: string, result: { duration: number, unit: T } } | null {
        const numberParse = this.numberParser.parse(value);

        if (!numberParse) {
            console.warn("Value must contains duration and unit.", value);

            return null;
        }

        const unitMatch = numberParse.remains.trim().match(this.unitPattern);
        if (!unitMatch) {
            console.warn("Cannot determine unit from ", numberParse.remains, "Allowed values are " + this.allowedUnits.join(", "));

            return null;
        }

        return {
            remains: numberParse.remains.split(unitMatch[0])[1],
            result : {
                duration: numberParse.result,
                unit    : unitMatch[0].toUpperCase() as T,
            },
        };

    }
}
