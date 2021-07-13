import mermaid from "mermaid";
import { DiagramToMermaid } from "../conversions/diagram-to-mermaid";
import { DiagramModel } from "../model/diagram-model";
import { PlaygroundPreview } from "./playground-preview";

export class PlaygroundMermaid extends PlaygroundPreview {
    private readonly memaidExporter = new DiagramToMermaid();

    public constructor(element: HTMLElement) {
        super(element);
        mermaid.initialize({startOnLoad: true});
    }

    public setModel(model: DiagramModel): void {
        this.renderInto(model);
    }

    public renderInto(model: DiagramModel): void {
        mermaid.mermaidAPI.render(
            "graphDiv",
            this.memaidExporter.modelToDiagram(model),
            (svgCode: string) => this.element.innerHTML = svgCode,
        );
    }

    public clearData(): void {
        this.element.innerHTML = "";
    }

    public saveSvg(): void {
        const svg        = this.element.querySelector("#graphDiv") as SVGElement;
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
    }
}
