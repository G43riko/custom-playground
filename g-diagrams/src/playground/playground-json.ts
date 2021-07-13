import { editor as MonacoEditor } from "monaco-editor";
import { DiagramToString } from "../conversions/serializer/diagram-to-string";
import { DiagramModel } from "../model/diagram-model";
import { PlaygroundPreview } from "./playground-preview";

export class PlaygroundJson extends PlaygroundPreview {
    private readonly parser = new DiagramToString();
    private viewer          = MonacoEditor.create(this.element, {
        language                  : "json",
        automaticLayout           : true,
        readOnly                  : true,
        scrollBeyondLastLine      : false,
        occurrencesHighlight      : false,
        selectionHighlight        : false,
        highlightActiveIndentGuide: false,
        foldingHighlight          : false,
        renderLineHighlight       : "none",
    });

    public setViewerText(text: string): void {
        this.viewer.setValue(text);
    }

    public setModel(model: DiagramModel): void {
        // const modelData = getGoModelJSONFromModel(model);
        const modelData = this.parser.serialize(model);
        this.setViewerText(JSON.stringify(JSON.parse(modelData), null, 4));
    }

    public clearData(): void {
        this.setViewerText("");
    }
}
