import {ScriptingCommandParamParser} from "../scripting-command-param-parser";

export class CommandStringParser implements ScriptingCommandParamParser<string> {
    public constructor(private readonly pattern?: RegExp) {
    }

    public parse(value: string): { remains: string, result: string } | null {
        if (!this.pattern) {
            return this.parseLocally(value);
        }
        const result = this.parseLocally(value);

        return result && this.pattern.test(result.result) ? result : null;
    }

    private parseLocally(value: string): { remains: string, result: string } | null {
        const trimmedContent = value.trim();


        if (trimmedContent.indexOf("\"") === 0) {
            if (trimmedContent.indexOf("\\\"") < 0) {
                const startIndex = value.indexOf("\"");
                const endIndex   = value.indexOf("\"", startIndex + 1);

                return {
                    result : value.substring(startIndex + 1, endIndex),
                    remains: value.substr(endIndex + 1),
                };
            }
            throw new Error("Not implemented");
        }

        const startMatch = trimmedContent.match(/(\W|^)(\w)/) as RegExpMatchArray;
        if (!startMatch) {
            return null;
        }
        const startIndex = value.indexOf(startMatch[2]);
        const endMatch   = value.match(/\w(\W|$)/) as RegExpMatchArray;

        return {
            result : value.substring(startIndex, endMatch.index! + 1),
            remains: value.substr(endMatch.index! + 1),
        };
    }
}
