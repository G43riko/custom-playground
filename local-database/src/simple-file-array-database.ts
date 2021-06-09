import {StatefulFileAccessor} from "./stateful-file-accessor";
import {Observable, of} from "rxjs";
import {catchError, first, map} from "rxjs/operators";

export class SimpleFileArrayDatabase<Value> extends StatefulFileAccessor {
    public readonly data$: Observable<Value[]> = this.rawData$.pipe(
        map((rawData) => JSON.parse(rawData)),
        catchError((error) => {
            console.error("Error during accessing activeClientsFile", error);

            return of(this.defaultData);
        }),
    )

    public constructor(pathToFile: string, protected readonly defaultData: Value[] = []) {
        super(pathToFile);
    }

    public getDataOnce(): Observable<Value[]> {
        return this.data$.pipe(first());
    }

    public setData(data: Value[]): Observable<boolean> {
        return this.writeFile(JSON.stringify(data)).pipe(
            map(() => true),
            catchError((error) => {
                console.error("Error during writing activeClientsFile", error);

                return of(false);
            }),
        );
    }
}
