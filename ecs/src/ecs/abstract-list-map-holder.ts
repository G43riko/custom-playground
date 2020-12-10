type KeyType = string | number | symbol;

export class AbstractListMapHolder<T, S extends keyof T = keyof T, U extends T[S] & KeyType = T[S] & KeyType> implements IterableIterator<T> {
    private readonly list: T[]               = [];
    private readonly map: { [key in U]?: T } = {};

    private pointer = 0;

    public constructor(private readonly key: S) {
    }

    public get length(): number {
        return this.list.length;
    }

    public get values(): readonly T[] {
        return this.list;
    }

    /**
     * @inheritDoc
     */
    public [Symbol.iterator](): IterableIterator<T> {
        this.pointer = 0;

        return this;
    }

    /**
     * @inheritDoc
     */
    public next(): IteratorResult<T> {
        if (this.pointer < this.list.length) {
            return {
                done : false,
                value: this.list[this.pointer++]
            };
        }

        return {
            done : true,
            value: null
        };
    }

    public add(item: T): void {
        // @ts-ignore
        this.map[item[this.key] as any] = item;
        this.list.push(item);
    }

    public clear(): void {
        this.list.forEach((item) => {
            // @ts-ignore
            delete this.map[item[this.key] as any];
        });
        this.list.splice(0, this.list.length);
    }

    public remove(id: U): void {
        delete this.map[id];
        const index = this.list.findIndex((c) => c[this.key] === id);
        this.list.splice(index, 1);
    }

    public forEach(callback: (item: T, index: number) => void): void {
        this.list.forEach(callback);
    }

    public has(id: U): boolean {
        return id in this.map;
    }

    public get(id: U): T | undefined {
        return this.map[id];
    }

    public keys(): readonly KeyType[] {
        return Object.keys(this.map);
    }
}
