import {CommandNumberParser} from "./command-number-parser";
import {ScriptingCommandParamParser} from "../scripting-command-param-parser";
import {ScriptingCommandParamParserSubResult} from "../scripting-command-param-parser-sub-result";

export class CommandTimeParser<T extends string> implements ScriptingCommandParamParser<{ unit: T, duration: number }> {
    private readonly numberParser = new CommandNumberParser();
    private readonly unitPattern = new RegExp("^(" + this.allowedUnits.join("|") + ")$", "i")

    public constructor(
        private readonly defaultUnit?: T,
        private readonly allowedUnits = ["MS", "S", "M", "H"] as T[],
    ) {

        if (defaultUnit && !allowedUnits.includes(defaultUnit)) {
            throw new Error("Default unit is not within allowed units: " + allowedUnits.join(", "));
        }
    }

    public parse(value: string): ScriptingCommandParamParserSubResult<{ duration: number, unit: T }> | null {
        const numberParse = this.numberParser.parse(value);

        if (!numberParse) {
            console.warn("Value must contains duration and unit.", value);

            return null;
        }

        const parsedUnit = this.parseUnit(numberParse.remains);
        if (!parsedUnit) {
            console.warn("Cannot determine unit from ", numberParse.remains, "Allowed values are " + this.allowedUnits.join(", "));

            return null;
        }

        const remains = numberParse.remains.split(parsedUnit)[1];

        return {
            remains,
            result: {
                duration: numberParse.result,
                unit: parsedUnit.toUpperCase() as T,
            },
        };

    }

    private parseUnit(numberParsingRemains: string): string | null {
        const unitMatch = numberParsingRemains.trim().match(this.unitPattern);
        if (unitMatch) {
            return unitMatch[0];
        }

        if (this.defaultUnit) {
            return this.defaultUnit;
        }

        return null;
    }
}
