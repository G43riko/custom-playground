import {Observable} from "rxjs";

export interface DataAccessor {
    writeFile(data: string): Observable<string>;

    readFile(): Observable<string>;
}
