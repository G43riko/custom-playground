export declare class FileHolder {
    static writeFileSync(path: string, content: string, options?: {
        encoding?: string;
    }): void;

    static isFile(path: string): boolean;

    static readFileSync(path: string, options?: {
        encoding?: string;
    }): string;
}
