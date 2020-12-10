interface EcsComponentData {
    readonly type: string;
}

interface EcsSystemData {
    readonly type: string;
}

class EcsHolder {
    private readonly componentData = new Map<string, EcsComponentData>();
    private readonly systemData    = new Map<string, EcsSystemData>();

    public addComponent(component: EcsComponentData): void {
        this.componentData.set(component.type, component);
    }

    public getComponent(type: string): EcsComponentData | undefined {
        return this.componentData.get(type);
    }

    public addSystem(component: EcsSystemData): void {
        this.systemData.set(component.type, component);
    }

    public getSystem(type: string): EcsSystemData | undefined {
        return this.systemData.get(type);
    }
}

export const Ecs = new EcsHolder();
