import {ScriptingCommandParamParser} from "../scripting-command-param-parser";
import {ScriptingCommandParamParserSubResult} from "../scripting-command-param-parser-sub-result";

export class CommandJSONParser<T = unknown> implements ScriptingCommandParamParser<T> {
    public constructor(private readonly allowComments = false) {
    }

    public parse(value: string): ScriptingCommandParamParserSubResult<T> | null {
        const startingCharacterMatch = value.match(/^\W*([{[])/);

        if (!startingCharacterMatch) {
            console.error(`Cannot parse JSON from '${value}'`);

            return null;
        }

        const startingChar = startingCharacterMatch[1] as "[" | "{";
        const startingCharacterIndex = value.indexOf(startingChar);

        const endingCharacterIndex = this.findEndingCharacterIndex(value, startingCharacterIndex, startingChar);

        if (endingCharacterIndex < 0) {
            console.error(`Cannot find closing character for bracket ${startingChar}`);

            return null;
        }

        const jsonString = value.substring(startingCharacterIndex, endingCharacterIndex + 1);
        const remains = value.substring(endingCharacterIndex + 1);
        const result = JSON.parse(jsonString) as T;

        return {result, remains};
    }

    private findEndingCharacterIndex(content: string, startingCharIndex: number, startingChar: "{" | "["): number {
        const endingChar = startingChar === "{" ? "}" : "]";
        let count = 0;

        for (let i = startingCharIndex; i < content.length; i++) {
            switch (content[i]) {
                case startingChar:
                    count++;
                    break;
                case endingChar:
                    count--;

                    if (count === 0) {
                        return i;
                    }
            }
        }

        return count === 0 ? content.length : -1;
    }
}
