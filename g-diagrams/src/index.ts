import { LanguageExporter } from "./conversions/language-exporter";
import { DiagramParser } from "./conversions/text-to-diagram/diagram-parser";
import { DiagramModel } from "./model/diagram-model";
import { PlaygroundEditor } from "./playground/playground-editor";
import { PlaygroundGojs } from "./playground/playground-gojs";
import { PlaygroundJson } from "./playground/playground-json";
import { PlaygroundList } from "./playground/playground-list";
import { PlaygroundManager } from "./playground/playground-manager";
import { PlaygroundMermaid } from "./playground/playground-mermaid";

const elements = {
    codeBlock          : document.getElementById("CodeBlock") as HTMLElement,
    codePreviewBlock   : document.getElementById("CodePreview") as HTMLElement,
    codeModelBlock     : document.getElementById("ModelWrapper") as HTMLElement,
    mermaidBlock       : document.getElementById("MermaidWrapper") as HTMLElement,
    listPreviewBlock   : document.getElementById("ListPreview") as HTMLElement,
    previewTypeSelector: document.getElementById("PreviewType") as HTMLSelectElement,
    languageSelector   : document.getElementById("languageSelector") as HTMLSelectElement,
    saveButton         : document.getElementById("saveButton") as HTMLButtonElement,
    saveSelect         : document.getElementById("saveSelect") as HTMLSelectElement,
};
const parser   = new DiagramParser({
    entityDivider              : "//--",
    generateLinksFromExtends   : true,
    generateLinksFromInterfaces: true,
});

export class PlaygroundGuiHandler {
    public onLanguageChange?: (language: string) => void;
    public onPreviewChange?: (preview: string) => void;
    public onSaveClick?: (value: string) => void;

    public createSaveAsDiv(values: string[]): HTMLDivElement {
        const result = document.createElement("div");
        const select = this.createSelect(values, values[0]);
        const button = document.createElement("button");
        button.value = "Save as";


        button.onclick = () => {
            if (this.onSaveClick) {
                this.onSaveClick(select.value);
            }
        };

        result.append(
            button,
            select,
        );

        return result;
    }

    public createLanguageSelect(languages: string[], selected: string): HTMLSelectElement {
        return this.createSelect(
            languages,
            selected,
            (value) => this.onLanguageChange?.(value),
        );
    }

    public createPreviewSelect(previewTypes: string[], selected: string): HTMLSelectElement {
        return this.createSelect(
            previewTypes,
            selected,
            (value) => this.onPreviewChange?.(value),
        );
    }

    private createSelect(options: string[], selected: string, changeCallback?: (value: string) => void): HTMLSelectElement {
        const select = document.createElement("select");

        select.onchange = () => changeCallback?.(select.value);

        select.append(
            ...options.map((optionValue) => {
                const option = document.createElement("option");

                option.value     = optionValue;
                option.innerText = optionValue.toLowerCase().replace(/^\w/, (e) => e.toUpperCase());

                if (optionValue === selected) {
                    option.selected = true;
                }

                return option;
            }),
        );

        return select;
    }
}

const getSelectedLanguage = (): string => elements.languageSelector.value;
let diagramModel: DiagramModel | undefined;
const playgroundEditor    = PlaygroundEditor.initEditorFromElement(elements.codeBlock, getSelectedLanguage());

const previews = {
    json   : new PlaygroundJson(elements.codePreviewBlock),
    graph  : new PlaygroundGojs(elements.codeModelBlock),
    mermaid: new PlaygroundMermaid(elements.mermaidBlock),
    list   : new PlaygroundList(elements.listPreviewBlock),
};

const playgroundManager = new PlaygroundManager(
    previews,
    {
        "typescript": LanguageExporter.typescript(),
        "javascript": LanguageExporter.javascript(),
        "java"      : LanguageExporter.java(),
    },
);


// elements.previewTypeSelector.onchange = () => playgroundManager.setActivePreview(elements.previewTypeSelector.value);
elements.languageSelector.onchange = () => playgroundEditor.setEditorLanguage(getSelectedLanguage());
elements.saveButton.onclick        = () => {
    switch (elements.saveSelect.value) {
        case "fullImg":
        case "img":
            return previews.graph.saveAsImage(elements.saveSelect.value === "fullImg");
        case "fullSvg":
        case "svg":
            return previews.graph.saveAsSvg(elements.saveSelect.value === "fullSvg");
        case "mermaidSvg":
            return previews.mermaid.saveSvg();
        case "java":
        case "javascript":
        case "typescript":
            if (!diagramModel) {
                return;
            }

            return playgroundManager.saveAsLanguage(elements.saveSelect.value, diagramModel);
    }
};

const onChange = (editorValue: string): void => {
    if (!editorValue?.trim()) {
        return playgroundManager.clearData();
    }

    try {
        // parse diagram
        diagramModel = parser.parseToDiagram(editorValue);

        playgroundManager.setModel(diagramModel);
    } catch (e) {
        // empty
    }
};

playgroundEditor.onEditorChange(onChange, true);

// elements.previewTypeSelector.value = "mermaid";
// elements.previewTypeSelector.onchange?.(null as any);
