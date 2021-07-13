import { Model as GoModel } from "gojs";
import { getGoModelJSONFromModel } from "../conversions/gojs-conversions/diagram-to-gojs-data";
import { CreateDiagramInElement } from "../conversions/gojs-conversions/gojs-exporter";
import { DiagramModel } from "../model/diagram-model";
import { PlaygroundPreview } from "./playground-preview";

export class PlaygroundGojs extends PlaygroundPreview {
    private readonly map     = new Map<number, { x: number; y: number; w: number; h: number }>();
    private readonly diagram = CreateDiagramInElement(this.element.id);

    public constructor(element: HTMLElement) {
        super(element);

        this.diagram.addDiagramListener("SelectionMoved", (e) => {
            e.subject.each((ee: any) => {
                const bbox = ee.actualBounds;
                if (bbox) {
                    this.map.set(ee.key, {
                        x: bbox.x,
                        y: bbox.y,
                        w: bbox.width,
                        h: bbox.height,
                    });
                }
            });
        });


    }

    public saveAsSvg(fullSize = true): void {
        const background = "white";
        const svg        = this.diagram.makeSvg({
            background,
            scale: fullSize ? 1 : undefined,
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
    }

    public saveAsImage(fullSize = true): void {
        const background = "white";
        const image      = this.diagram.makeImage({
            background,
            scale: fullSize ? 1 : undefined,
        }) as HTMLImageElement;

        const link    = document.createElement("a");
        link.href     = image.src;
        link.download = "something";
        document.body.append(link);
        link.click();

        document.body.removeChild(link);
    }

    public clearData(): void {
        this.diagram.clear();
        this.map.clear();
    }

    public setModel(diagramModel: DiagramModel): void {
        const goModelData  = getGoModelJSONFromModel(diagramModel);
        this.diagram.model = GoModel.fromJson(goModelData);

        this.diagram.model.nodeDataArray.forEach((e) => {
            const part = this.diagram.findPartForKey(e.key);
            const bbox = part?.actualBounds;
            if (bbox) {
                this.map.set(e.key, {
                    x: bbox.x,
                    y: bbox.y,
                    w: bbox.width,
                    h: bbox.height,
                });
            }
        });
    }
}
