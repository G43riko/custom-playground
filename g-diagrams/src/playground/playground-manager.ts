import { DiagramModel } from "../model/diagram-model";
import { PlaygroundPreview } from "./playground-preview";

export class PlaygroundManager {
    public constructor(
        private readonly previews: { [preview: string]: PlaygroundPreview },
        private readonly exporters: { [language: string]: { getString(model: DiagramModel): string } },
    ) {
    }

    public setActivePreview(preview: string): void {
        Object.entries(this.previews).forEach(([name, value]) => {
            name === preview ? value.show() : value.hide();
        });
    }

    public saveAsLanguage(language: string, diagramModel: DiagramModel): void {

        const exporter = this.exporters[language];
        if (!exporter) {
            throw new Error(`Language '${language}' is not supported`);
        }

        const url = `data:text/plain;charset=utf-8,${encodeURIComponent(exporter.getString(diagramModel))}`;

        const link    = document.createElement("a");
        link.href     = url;
        link.download = "something.ts";
        document.body.append(link);
        link.click();

        document.body.removeChild(link);
    }

    public setModel(diagramModel: DiagramModel): void {
        Object.values(this.previews).forEach((preview) => preview.setModel(diagramModel));
    }

    public clearData(): void {
        Object.values(this.previews).forEach((preview) => preview.clearData());
    }
}
