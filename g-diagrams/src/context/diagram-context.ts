import {DiagramEntity} from "../class/entity/diagram-entity";
import {DiagramMethod} from "../class/method/diagram-method";
import {DiagramProperty} from "../class/property/diagram-property";

interface DiagramContext {
    addItem(value: DiagramEntity | DiagramMethod | DiagramProperty): void;
}

export class DiagramContextInstance implements DiagramContext {
    public static EMPTY: DiagramContext = {
        addItem: () => null,
    };
    protected readonly items = new Map<string, DiagramEntity | DiagramMethod | DiagramProperty>();

    /**
     * add new item to map of all items inside context
     * @param value - new item
     */
    public addItem(value: DiagramEntity | DiagramMethod | DiagramProperty): void {
        if (this.items.has(value.name)) {
            throw new Error("Entity already has registered name " + value.name);
        }

        this.items.set(value.name, value);
    }

    /**
     * Return true if object with given name exists in this context
     * @param name - name of searched object
     * @protected
     */
    protected has(name: string): boolean {
        return this.items.has(name);
    }
}

