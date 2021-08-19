import { editor as MonacoEditor } from "monaco-editor";

export class PlaygroundEditor {
    private readonly editor?: MonacoEditor.IStandaloneCodeEditor;
    private readonly editorModel?: MonacoEditor.ITextModel

    public constructor(
        private readonly element: HTMLElement,
        language: string,
        value: string,
    ) {
        this.editor      = MonacoEditor.create(element, {
            value,
            language,
            automaticLayout     : true,
            minimap             : {
                enabled: true,
            },
            scrollBeyondLastLine: false,
        });
        this.editorModel = this.editor.getModel() as MonacoEditor.ITextModel;
    }

    public static initEditorFromElement(element: HTMLElement, language: string, cleanUpElement = true): PlaygroundEditor {
        const value = element.innerText.trim();
        if (cleanUpElement) {
            element.innerHTML = "";
        }

        return new PlaygroundEditor(element, language, value);
    }

    public getEditorText(): string {
        return this.editor?.getValue() ?? "";
    }

    public onEditorChange(callback: (text: string) => void, emitOnInit = false): void {
        this.editorModel?.onDidChangeContent(() => callback(this.getEditorText()));
        if (emitOnInit) {
            callback(this.getEditorText());
        }
    }

    public setEditorLanguage(language: string): void {
        if (this.editorModel) {
            MonacoEditor.setModelLanguage(this.editorModel, language);
        }
    }

}
