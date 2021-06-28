import {ScriptingParserDataProvider} from "./scripting-parser-data-provider";
import {CommandStringParser} from "./parsers/command-string-parser";

export class EntityIdAsyncParser extends CommandStringParser {
    public constructor(
        checker: (id: string) => Promise<boolean>,
    ) {
        super();
    }

}

export function entityValidator(entityId: string): Promise<boolean> {
    return Promise.resolve(entityId.startsWith("_"));
}

export function demo1() {
    const holder = ScriptingParserDataProvider.fromFlatArray([
        [new EntityIdAsyncParser(entityValidator), "ENTITY_ID", "o"],
    ]);
}
