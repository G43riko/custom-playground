import {SimpleFileDatabase} from "./simple-file.database";

export class SimpleFileObjectDatabase<Value extends Record<string, unknown>> extends SimpleFileDatabase<Value[]> {
}
