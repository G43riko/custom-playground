import { DiagramModel } from "../model/diagram-model";

export abstract class PlaygroundPreview {
    public constructor(
        protected readonly element: HTMLElement,
    ) {
    }

    public show(): void {
        this.element.style.display = "block";
    }

    public hide(): void {
        this.element.style.display = "none";
    }

    public setModel(model: DiagramModel): void {
        // to be implemented in child
    }

    public clearData(): void {
        // to be implemented in child
    }
}
