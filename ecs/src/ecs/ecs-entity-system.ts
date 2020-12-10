import { EcsComponentType } from "./ecs-component";
import { EcsEngine } from "./ecs-engine";
import { EcsEntity } from "./ecs-entity";
import { EcsEntityListener } from "./ecs-listeners";

export enum EcsEntitySystemMode {
    SYNC  = "SYNC",
    ASYNC = "ASYNC",
}

export function EcsSystem<T extends EcsComponentType>(): (constructor: T) => any {
    return (constructor: T): T => {
        return class extends constructor {
            public readonly type = constructor.type;
        };
    }
}


export abstract class EcsEntitySystem implements EcsEntityListener {
    public readonly abstract type: string;
    protected engine?: EcsEngine;
    private processing    = true;
    private readonly data = {
        updating: false,
    };

    public get updating(): boolean {
        return this.data.updating;
    }

    public abstract update(delta: number): void | Promise<void>;

    public entityAdded(entity: EcsEntity): void {
        // to be implemented
    }

    public entityRemoved(entity: EcsEntity): void {
        // to be implemented
    }

    public async run(delta: number, mode = EcsEntitySystemMode.SYNC): Promise<void> {
        if (mode === EcsEntitySystemMode.SYNC) {
            try {
                this.update(delta);
            } catch (e) {
                this.onError(e);
            }
        } else {
            this.data.updating = true;
            try {
                await this.update(delta);
            } catch (e) {
                this.onError(e);
            } finally {
                this.data.updating = false;
            }
        }
    }

    public isProcessing(): boolean {
        return this.processing;
    }

    public setProcessing(processing: boolean): void {
        this.processing = processing;
    }

    public onAddToEngine(engine: EcsEngine): void {
        // to be implemented

    }

    public onRemoveFromEngine(engine: EcsEngine): void {
        // to be implemented

    }

    public setEngine(engine?: EcsEngine): void {
        engine ? this.onAddToEngine(engine) : this.onRemoveFromEngine(this.engine as EcsEngine);
        this.engine = engine;
    }

    protected onError(error: any): void {
        // to be implemented

    }
}
