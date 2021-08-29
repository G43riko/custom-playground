import {StatefulDataAccessor} from "./stateful-data-accessor";
import {Observable, of} from "rxjs";
import {catchError, first, map} from "rxjs/operators";
import {DataSerializer} from "./data-serializers/data-serializer";
import {JsonSerializer} from "./data-serializers/json-serializer";
import {SimpleFileAccessor} from "./data-accessors/simple-file-accessor";

export class SimpleFileDatabase<Value> extends StatefulDataAccessor {
    public readonly data$: Observable<Value> = this.rawData$.pipe(
        map((rawData) => this.serializer.fromString(rawData)),
        catchError((error) => {
            console.error("Error during accessing file", error);

            return of(this.defaultData as Value);
        }),
    )

    public constructor(
        pathToFile: string,
        protected readonly defaultData?: Value,
        private readonly serializer: DataSerializer<Value> = new JsonSerializer(),
    ) {
        super(new SimpleFileAccessor(pathToFile));
    }

    public get dataOnce$(): Observable<Value> {
        return this.data$.pipe(first());
    }

    public setData(data: Value): Observable<boolean> {
        return this.writeData(this.serializer.toString(data)).pipe(
            map(() => true),
            catchError((error) => {
                console.error("Error during writing file", error);

                return of(false);
            }),
        );
    }
}
