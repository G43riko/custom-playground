import {ScriptingCommandParamParserResult} from "./parsers/scripting-command-param-parser-result";
import {ScriptingValidatorResult} from "./scripting-validator-result";

export interface ScriptingCommandParamValidator<T = unknown> {
    validate(value: T): Promise<ScriptingValidatorResult>
}

export const ScriptingCommandParamValidator = {
    min: (minValue: number) => ({
        async validate(valueToParse: number): Promise<ScriptingValidatorResult> {
            if (isNaN(valueToParse)) {
                return [{
                    message: "Value is not a number",
                }];
            }
            if (valueToParse < minValue) {
                return [{
                    message: `Value ${valueToParse} is lower then minimal value ${minValue}`,
                }];
            }

            return null;
        },
    }),
    max: (maxValue: number) => ({
        async validate(data: (ScriptingCommandParamParserResult<number> | null)[]): Promise<ScriptingValidatorResult> {
            const valueToParse = data[0]?.data;
            if (typeof valueToParse === "undefined") {
                return [{
                    message: "Value is not a number",
                }];
            }
            if (valueToParse > maxValue) {
                return [{
                    message: `Value ${valueToParse} is greater then maximal value ${maxValue}`,
                }];
            }

            return null;
        },
    }),
};
