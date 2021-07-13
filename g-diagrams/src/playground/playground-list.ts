import { DiagramEntity } from "../class/entity/diagram-entity";
import { DiagramModel } from "../model/diagram-model";
import { PlaygroundPreview } from "./playground-preview";

export class PlaygroundList extends PlaygroundPreview {
    public setModel(model: DiagramModel) {
        this.element.innerHTML = `
        <div class="entity-list-item">
            <span></span>
            <span>type</span>
            <span>Name</span>
            <span>P</span>
            <span>M</span>
            <span>G</span>
        </div>
        `;
        model.forEachEntity((entity) => {
            this.element.append(this.createEntityElement(entity));
        });
    }

    public clearData() {
        this.element.innerHTML = "";
    }

    private createElement<T extends keyof HTMLElementTagNameMap>(name: T, innerHtml: string, className?: string): HTMLElementTagNameMap[T] {
        const result = document.createElement(name);

        if (className) {
            result.className = className;
        }

        result.innerHTML = innerHtml;

        return result;
    }

    private createEntityElement(entity: DiagramEntity): HTMLElement {
        const checkbox     = document.createElement("input");
        checkbox.type      = "checkbox";
        checkbox.className = "filled-in";
        checkbox.checked   = true;
        checkbox.onclick   = (e: any) => e.preventDefault();


        const result     = document.createElement("div");
        result.className = "entity-list-item";
        result.onclick   = () => checkbox.checked = !checkbox.checked;

        const label = document.createElement("label");
        label.append(
            checkbox,
            this.createElement("span", ""),
        );

        result.append(
            label,
            this.createElement("em", entity.type),
            this.createElement("strong", entity.name),
            this.createElement("span", `${entity.properties?.length ?? 0}`),
            this.createElement("span", `${(entity as any).methods?.length ?? 0}`),
            this.createElement("span", `${(entity as any).generics?.length ?? 0}`),
        );

        return result;
    }
}
