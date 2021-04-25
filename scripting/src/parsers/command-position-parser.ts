import { CommandParamParser, CommandParamParserResult } from "./command-param-parser";
import { CommandVectorParser } from "./command-vector-parser";

/**
 * this should probable parse number divided by comma
 */
export class CommandPositionParser implements CommandParamParser<{ values: number[], absolute: boolean }> {
    private readonly vectorParser = new CommandVectorParser(this.dimensions, this.isInteger);

    public constructor(
        private readonly dimensions: number,
        private readonly requiredType?: "RELATIVE" | "ABSOLUTE",
        private readonly isInteger?: boolean,
        private readonly relativeFlag = "_",
    ) {
    }

    public parse(value: string): CommandParamParserResult<{ values: number[], absolute: boolean }> | null {
        const absolute = value.trim()[0] !== this.relativeFlag;

        if (this.requiredType === (absolute ? "RELATIVE" : "ABSOLUTE")) {
            console.warn("Required relative position");

            return null;
        }

        const result = this.vectorParser.parse(absolute ? value : value.replace("_", ""));
        if (!result) {
            return null;
        }

        return {
            result : {
                absolute,
                values: result.result,
            },
            remains: result.remains,
        };
    }
}
