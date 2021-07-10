import { Model as GoModel } from "gojs";
import mermaid from "mermaid";
import { editor as MonacoEditor } from "monaco-editor";
import { DiagramToMermaid } from "./conversions/diagram-to-mermaid";
import { getGoModelJSONFromModel } from "./conversions/gojs-conversions/diagram-to-gojs-data";
import { CreateDiagramInElement } from "./conversions/gojs-conversions/gojs-exporter";
import { LanguageExporter } from "./conversions/language-exporter";
import { DiagramParser } from "./conversions/text-to-diagram/diagram-parser";
import { DiagramModel } from "./model/diagram-model";

const elements = {
    codeBlock          : document.getElementById("CodeBlock") as HTMLElement,
    codePreviewBlock   : document.getElementById("CodePreview") as HTMLElement,
    codeModelBlock     : document.getElementById("ModelWrapper") as HTMLElement,
    mermaidBlock       : document.getElementById("MermaidWrapper") as HTMLElement,
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


const getSelectedLanguage    = (): string => elements.languageSelector.value;
let diagramModel: DiagramModel | undefined;
const value                  = elements.codeBlock.innerText?.trim();
elements.codeBlock.innerHTML = "";

const viewer = MonacoEditor.create(elements.codePreviewBlock, {
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

elements.previewTypeSelector.onchange = () => {
    switch (elements.previewTypeSelector.value) {
        case "json":
            elements.codePreviewBlock.style.display = "block";
            elements.codeModelBlock.style.display   = "none";
            elements.mermaidBlock.style.display     = "none";
            break;
        case "graph":
            elements.codePreviewBlock.style.display = "none";
            elements.codeModelBlock.style.display   = "block";
            elements.mermaidBlock.style.display     = "none";
            break;
        case "mermaid":
            elements.codePreviewBlock.style.display = "none";
            elements.codeModelBlock.style.display   = "none";
            elements.mermaidBlock.style.display     = "block";
            break;
    }
};
elements.languageSelector.onchange    = () => MonacoEditor.setModelLanguage(editorModel, getSelectedLanguage());

const diagram = CreateDiagramInElement("ModelWrapper");

mermaid.initialize({startOnLoad: true});
elements.saveButton.onclick = () => {
    const background = "white";
    switch (elements.saveSelect.value) {
        case "fullImg":
        case "img": {
            const image = diagram.makeImage({
                background,
                scale: elements.saveSelect.value === "fullImg" ? 1 : undefined,
            }) as HTMLImageElement;

            const link    = document.createElement("a");
            link.href     = image.src;
            link.download = "something";
            document.body.append(link);
            link.click();

            document.body.removeChild(link);
            break;
        }
        case "fullSvg":
        case "svg": {
            const svg        = diagram.makeSvg({
                background,
                scale: elements.saveSelect.value === "fullSvg" ? 1 : undefined,
            });
            const serializer = new XMLSerializer();
            let source       = serializer.serializeToString(svg);
            //add name spaces.
            if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
                source = source.replace(/^<svg/, "<svg xmlns=\"http://www.w3.org/2000/svg\"");
            }
            if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
                source = source.replace(/^<svg/, "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\"");
            }

            //add xml declaration
            source = `<?xml version="1.0" standalone="no"?>\r\n${source}`;

            //convert svg source to URI data scheme.
            const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

            const link    = document.createElement("a");
            link.href     = url;
            link.download = "something";
            document.body.append(link);
            link.click();

            document.body.removeChild(link);
            break;
        }
        case "ts": {
            const exporter = LanguageExporter.typescript();

            if (!diagramModel) {
                return;
            }

            const url = `data:text/plain;charset=utf-8,${encodeURIComponent(exporter.getString(diagramModel))}`;

            const link    = document.createElement("a");
            link.href     = url;
            link.download = "something.ts";
            document.body.append(link);
            link.click();

            document.body.removeChild(link);
            break;
        }
    }
};

const memaidExporter = new DiagramToMermaid();

const onChange = (): void => {
    const editorValue = editor.getValue();
    if (!editorValue) {
        return viewer.setValue("");
    }

    try {
        // parse diagram
        diagramModel = parser.parseToDiagram(editorValue);


        //mermaid
        console.log(memaidExporter.modelToDiagram(diagramModel));
        mermaid.mermaidAPI.render(
            "graphDiv",
            memaidExporter.modelToDiagram(diagramModel),
            (svgCode: string) => elements.mermaidBlock.innerHTML = svgCode,
        );


        // create and set model to diagram
        const goModelData = getGoModelJSONFromModel(diagramModel);
        diagram.model     = GoModel.fromJson(goModelData);

        // show JSON
        viewer.setValue(JSON.stringify(JSON.parse(goModelData), null, 4));

        // show output in console
        // const exporter = LanguageExporter.javascript();
        // console.log(exporter.getString(diagramModel));


    } catch (e) {
        // empty
    }
};

editorModel.onDidChangeContent(onChange);
onChange();

elements.previewTypeSelector.value = "mermaid";
elements.previewTypeSelector.onchange?.(null as any);
