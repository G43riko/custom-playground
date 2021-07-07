import { Model as GoModel } from "gojs";
import { editor as MonacoEditor } from "monaco-editor";
import { getGoModelJSONFromModel } from "./conversions/gojs-conversions/diagram-to-gojs-data";
import { CreateDiagramInElement } from "./conversions/gojs-conversions/gojs-exporter";
import { DiagramParser } from "./conversions/text-to-diagram/diagram-parser";

const elements = {
    codeBlock       : document.getElementById("CodeBlock") as HTMLElement,
    previewBlock    : document.getElementById("CodePreview") as HTMLElement,
    languageSelector: document.getElementById("languageSelector") as HTMLSelectElement,
};
const parser   = new DiagramParser({
    entityDivider              : "//--",
    generateLinksFromExtends   : true,
    generateLinksFromInterfaces: true,
});

const getSelectedLanguage = (): string => elements.languageSelector.value;

const value                  = elements.codeBlock.innerText?.trim();
elements.codeBlock.innerHTML = "";

const viewer = MonacoEditor.create(elements.previewBlock, {
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

const editor = MonacoEditor.create(elements.codeBlock, {
    value,
    language            : getSelectedLanguage(),
    automaticLayout     : true,
    minimap             : {
        enabled: true,
    },
    scrollBeyondLastLine: false,
});

const editorModel = editor.getModel() as MonacoEditor.ITextModel;

elements.languageSelector.onchange = () => MonacoEditor.setModelLanguage(editorModel, getSelectedLanguage());

const diagram = CreateDiagramInElement("ModelWrapper");

const onChange = (): void => {
    const editorValue = editor.getValue();
    if (!editorValue) {
        return viewer.setValue("");
    }

    try {
        const parsedDiagram = parser.parseToDiagram(editorValue);

        // create and set model to diagram
        const goModelData = getGoModelJSONFromModel(parsedDiagram);
        diagram.model     = GoModel.fromJson(goModelData);

        // show JSON
        viewer.setValue(JSON.stringify(JSON.parse(goModelData), null, 4));
    } catch (e) {
        // empty
    }
};

editorModel.onDidChangeContent(onChange);
onChange();
