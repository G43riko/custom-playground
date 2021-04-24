import { CommandNumberParser } from "./command-number-parser";
import { CommandParamParser } from "./command-param-parser";

/**
 * this should probable parse number divided by comma
 */
export class CommandVectorParser implements CommandParamParser<number[]> {
    private readonly numberParser = new CommandNumberParser(this.isInteger);

    public constructor(private readonly dimensions: number, private readonly isInteger?: boolean) {
    }

    public parse(value: string): { remains: string, result: number[] } | null {
        const result: number[] = [];
        let remains            = value;

        for (let i = 0; i < this.dimensions; i++) {
            const tmpResult = this.numberParser.parse(remains);
            if (!tmpResult) {
                return null;
            }
            result.push(tmpResult.result);
            remains = tmpResult.remains;
        }

        return {result, remains};
    }
}
