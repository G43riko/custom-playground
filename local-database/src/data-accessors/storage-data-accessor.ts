import {DataAccessor} from "./data-accessor";
import {Observable, of} from "rxjs";

export class StorageDataAccessor implements DataAccessor {
    public constructor(
        private readonly key: string,
        private readonly storage: Storage = sessionStorage,
    ) {
    }

    public readFile(): Observable<string> {
        return of(this.storage.getItem(this.key) || "");
    }

    public writeFile(data: string): Observable<string> {
        this.storage.setItem(this.key, data);

        return of(data);
    }
}