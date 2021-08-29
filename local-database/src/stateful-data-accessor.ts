import {BasicSimpleFileAccessor, SimpleFileAccessor} from "./data-accessors/simple-file-accessor";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {first, shareReplay, startWith, switchMap, tap} from "rxjs/operators";
import {DataAccessor} from "./data-accessors/data-accessor";

export class StatefulDataAccessor {
    private readonly dataChangedSource$ = new Subject<void>();
    public readonly rawData$ = this.dataChangedSource$.pipe(
        startWith(null as unknown),
        switchMap(() => this.dataAccessor.readFile()),
        shareReplay({
            refCount: true,
            bufferSize: 1,
        }),
    );

    public constructor(
        private readonly dataAccessor: DataAccessor,
    ) {
    }

    public getRawDataOnce(): Observable<string> {
        return this.rawData$.pipe(first());
    }

    public writeData(data: string): Observable<string> {
        return this.dataAccessor.writeFile(data).pipe(
            tap(() => this.dataChangedSource$.next()),
        );
    }
}

export class StatefulFileAccessorNew extends SimpleFileAccessor {
    private readonly dataSource$ = new BehaviorSubject<string>("[]");

    public readonly rawData$ = this.dataSource$.asObservable();

    public constructor(
        pathToFile: string,
        fileAccessor?: BasicSimpleFileAccessor,
    ) {
        super(pathToFile, fileAccessor);
        super.readFile().pipe(
            first(),
        ).subscribe((data) => {
            this.dataSource$.next(data);
        });
    }

    public writeFile(data: string): Observable<string> {
        return super.writeFile(data).pipe(
            tap((data) => this.dataSource$.next(data)),
        );
    }
}
