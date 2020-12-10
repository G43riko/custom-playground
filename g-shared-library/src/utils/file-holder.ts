import * as fs from "fs"

export class FileHolder {
    public static writeFileSync(path: string, content: string, options: { encoding?: string } = {}): void {
        const encoding: "utf8" = (options.encoding || "utf8") as "utf8";
        fs.writeFileSync(path, content, {encoding});
    }

    public static isFile(path: string): boolean {
        return fs.statSync(path).isFile();
    }

    public static readFileSync(path: string, options: { encoding?: string } = {}): string {
        const encoding: "utf8" = (options.encoding || "utf8") as "utf8";

        return fs.readFileSync(path, {encoding});
    }
}
