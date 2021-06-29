import {ScriptingCommandExecutor} from "./scripting-command-executor";
import {ScriptingCommandParamParserResult} from "../parsers/scripting-command-param-parser-result";

export class MathExecutor implements ScriptingCommandExecutor<{ operator: string, numbers: [] }, number> {
    public execute(data: { operator: string, numbers: [] }): number {
        switch (data.operator.toLowerCase()) {
            case "plus":
            case "sum":
            case "add":
                return data.numbers.reduce((acc, num) => acc + num, 0);
            case "mul":
            case "multiplication":
                return data.numbers.reduce((acc, num) => acc * num, 1);
            case "sub":
            case "subtract":
                return (data.numbers as any).reduce((acc: number, num: number) => acc - num);
            case "avg":
            case "average":
                return data.numbers.reduce((acc, num) => acc + num, 0) / data.numbers.length;
            case "max":
                return Math.max(...data.numbers);
            case "min":
                return Math.min(...data.numbers);
            default:
                console.warn(`Unknown operator ${data.operator}`);

                return 0;
        }
    }

    public executeRaw(data: (ScriptingCommandParamParserResult<{ operator: string, numbers: [] }> | null)[] | null): number {
        if (!data || data.length < 2) {
            throw new Error("Invalid parameters. Math operators require `MATH {operator} {num[]}` ");

        }


        return this.execute({
            operator: data[0]!.data as any,
            numbers: data[1]!.data as any,
        });
    }
}
