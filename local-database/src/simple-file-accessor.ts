import fs from "fs";
import {bindNodeCallback, Observable} from "rxjs";
import {map} from "rxjs/operators";

export class BasicSimpleFileAccessor {
    public readonly readFile = bindNodeCallback<string, string>((
        path: string,
        callback: (error: Error | null, text: string) => void,
    ) => fs.readFile(path, this.encoding, callback));
    public readonly writeFile2 = bindNodeCallback<string, string, void>((
        path: string,
        content: string,
        callback: fs.NoParamCallback,
    ) => fs.writeFile(path, content, this.encoding, callback));

    // public writeFile(filePath: string, content: string): Observable<string> {
    //     fs.writeFileSync(filePath, content, {encoding: this.encoding, flag: "w"});
    //
    //     return of(content);
    // }

    public constructor(
        private readonly encoding: BufferEncoding = "utf-8",
    ) {
    }

    public writeFile(filePath: string, content: string): Observable<string> {
        return this.writeFile2(filePath, content).pipe(
            map(() => content),
        );
    }
}

export class SimpleFileAccessor {
    public constructor(
        public readonly pathToFile: string,
        private readonly fileAccessor = new BasicSimpleFileAccessor(),
    ) {
    }

    public writeFile(data: string): Observable<string> {
        return this.fileAccessor.writeFile(this.pathToFile, data);
    }

    public readFile(): Observable<string> {
        return this.fileAccessor.readFile(this.pathToFile);
    }
}
