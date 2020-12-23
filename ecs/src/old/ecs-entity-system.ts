import { EcsEntityListener } from "../ecs/ecs-listeners";
import { EcsSystemMode } from "../ecs/ecs-system-mode";
import { EcsEngine } from "./ecs-engine";
import { EcsEntity } from "./ecs-entity";

export abstract class EcsEntitySystem implements EcsEntityListener<EcsEntity> {
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

    public async run(delta: number, mode = EcsSystemMode.SYNC): Promise<void> {
        if (mode === EcsSystemMode.SYNC) {
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
