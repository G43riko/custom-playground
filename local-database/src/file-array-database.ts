import {Observable} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {SimpleFileArrayDatabase} from "./simple-file-array-database";

export class FileArrayDatabase<Value> extends SimpleFileArrayDatabase<Value> {
    public constructor(pathToFile: string, defaultData: Value[] = []) {
        super(pathToFile, defaultData);
    }

    public insertOne(item: Value): Observable<boolean> {
        return this.dataOnce$.pipe(
            switchMap((data) => this.setData([...data, item])),
        );
    }

    public insertMore(items: Value[]): Observable<boolean> {
        return this.dataOnce$.pipe(
            switchMap((data) => this.setData([...data, ...items])),
        );
    }

    public findOne(selector: (item: Value, index: number) => boolean): Observable<Value | undefined> {
        return this.dataOnce$.pipe(
            map((data) => data.find(selector)),
        );
    }

    public findMore(selector: (item: Value, index: number) => boolean): Observable<Value[]> {
        return this.dataOnce$.pipe(
            map((data) => data.filter(selector)),
        );
    }

    /**
     *
     * @param checker - returns true if item should be removed otherwise return false
     */
    public remove(checker: (item: Value, index: number) => boolean): Observable<boolean> {
        return this.dataOnce$.pipe(
            switchMap((data) => this.setData(data.filter((item, index) => !checker(item, index)))),
        );
    }

    public transform(transformer: (item: Value, index: number) => Value): Observable<boolean> {
        return this.dataOnce$.pipe(
            switchMap((data) => this.setData(data.map(transformer))),
        );
    }
}
