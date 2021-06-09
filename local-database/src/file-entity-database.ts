import {Observable, of} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {FileArrayDatabase} from "./file-array-database";

export interface FileEntityDatabaseOptions<T, R = string> {
    readonly defaultData: T[];
    readonly toStringMapper: (item: T) => R;
    readonly fromStringMapper: (item: R) => T;
}

export class FileEntityDatabase<Value, Key extends keyof Value = keyof Value> extends FileArrayDatabase<Value> {
    public constructor(private readonly key: Key, pathToFile: string, private readonly options: Partial<FileEntityDatabaseOptions<Value, any>> = {} as any) {
        super(pathToFile, options.defaultData);
    }

    public getTransformedData(): Observable<Value[]> {
        const mapFn = this.options?.fromStringMapper;
        if (!mapFn) {
            return this.data$;
        }

        return this.data$.pipe(
            map((data) => data.map(mapFn)),
        );
    }

    public setData(data: Value[]): Observable<boolean> {
        if (!this.isUnique(data)) {
            throw new Error("Data must be unique");
        }

        if (!this.options?.toStringMapper) {
            return super.setData(data);
        }

        return super.setData(
            data.map(this.options.toStringMapper),
        );
    }

    public findById(id: Value[Key]): Observable<Value | undefined> {
        return this.findOne((item) => item[this.key] === id);
    }

    public removeById(id: Value[Key]): Observable<boolean> {
        return this.remove((item) => item[this.key] === id);
    }

    public addItem(item: Value): Observable<boolean> {
        return this.getDataOnce().pipe(
            switchMap((data) => {
                const id = item[this.key];
                const existingItem = data.find((e) => e[this.key] === id);
                if (existingItem) {
                    throw new Error("Item with id " + id + " already exists");
                }

                return this.setData([...data, item]);
            }),
        );
    }

    /**
     * @param id
     * @param transformer
     * @param applyNull - if is true transformer can be used to add or remove items. <br/>
     * If transformer returns null item will be removed from list. <br/>
     * If item passed to transformer is null and  transform return not null value, this value will be added to collection
     */
    public transformOne(id: Value[Key], transformer: (item: Value, index: number) => Value, applyNull = true): Observable<boolean> {
        if (applyNull) {
            return this.getDataOnce().pipe(
                switchMap((data) => {
                    const itemIndex = data.findIndex((item) => item[this.key] === id);

                    const transformedItem = transformer(data[itemIndex], itemIndex);

                    if (transformedItem) {
                        if (itemIndex < 0) {
                            return this.setData([...data, transformedItem]);
                        }
                        const transformedData = data.map((item, index) => {
                            if (index === itemIndex) {
                                return transformedItem;
                            }

                            return item;
                        });

                        return this.setData(transformedData);
                    }
                    if (itemIndex) {
                        return this.setData(data.filter((_, index) => index !== itemIndex));
                    }

                    return of(false);
                }),
            );
        }

        return this.getDataOnce().pipe(
            switchMap((data) => {
                const itemIndex = data.findIndex((item) => item[this.key] === id);

                const transformedData = data.map((item, index) => {
                    if (index === itemIndex) {
                        return transformer(item, index) ?? item;
                    }

                    return item;
                });

                return this.setData(transformedData);
            }),
        );
    }

    private isUnique(data: Value[]): boolean {
        const idMap: { [key in string]?: true } = {};

        for (const item of data) {
            if ((item[this.key] as any) in idMap) {
                return false;
            }

            idMap[item[this.key] as any] = true;
        }

        return true;
    }
}
