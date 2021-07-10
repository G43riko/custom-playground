import * as go from "gojs";
import { DiagramAccessModifier } from "../../class/common/diagram-access-modifier";
import { DiagramEntityType } from "../../class/entity/diagram-entity-type";
import { DiagramLinkType } from "../../model/diagram-link-type";

const $ = go.GraphObject.make;

// show visibility or access as a single character at the beginning of each property or method
function convertVisibility(accessModifier: DiagramAccessModifier): string {
    switch (accessModifier) {
        case DiagramAccessModifier.PUBLIC:
            return "+";
        case DiagramAccessModifier.PRIVATE:
            return "-";
        case DiagramAccessModifier.PROTECTED:
            return "#";
        case DiagramAccessModifier.PACKAGE:
            return "~";
        default:
            return accessModifier;
    }
}

function convertEntityTypeToBGColor(type: DiagramEntityType): string {
    switch (type) {
        case DiagramEntityType.INTERFACE:
            return "mediumpurple";
        case DiagramEntityType.ENUM:
            return "palegreen";
        default:
            return "lightyellow";
    }
}

function convertIsTreeLink(linkType: DiagramLinkType): boolean {
    switch (linkType) {
        case DiagramLinkType.GENERALIZATION:
        case DiagramLinkType.REALIZATION:
            return true;
        default:
            return false;
    }
}

function convertFromArrow(linkType: DiagramLinkType): string {
    switch (linkType) {
        case DiagramLinkType.GENERALIZATION:
            return "";
        default:
            return "";
    }
}

function convertToArrow(linkType: DiagramLinkType): string {
    switch (linkType) {
        case DiagramLinkType.GENERALIZATION:
        case DiagramLinkType.REALIZATION:
            return "Triangle";
        case DiagramLinkType.AGGREGATION:
        case DiagramLinkType.COMPOSITION:
            return "StretchedDiamond";
        default:
            return "";
    }
}

function convertColorFromArrow(linkType: DiagramLinkType): string {
    switch (linkType) {
        case DiagramLinkType.GENERALIZATION:
        case DiagramLinkType.AGGREGATION:
        case DiagramLinkType.REALIZATION:
            return "white";
        case DiagramLinkType.COMPOSITION:
            return "black";
        default:
            return "";
    }
}

function convertDashArrayFromArrow(linkType: DiagramLinkType): number[] {
    switch (linkType) {
        case DiagramLinkType.REALIZATION:
            return [9, 3];
        default:
            return [];
    }
}

export function CreateDiagramInElement(id: string, options: { animation?: boolean } = {}): go.Diagram {
    const myDiagram = $(
        go.Diagram,
        id,
        {
            "undoManager.isEnabled"     : true,
            "animationManager.isEnabled": options.animation ?? false,
            layout                      : $(go.TreeLayout,
                { // this only lays out in trees nodes connected by "generalization" links
                    angle            : 90,
                    path             : go.TreeLayout.PathSource,  // links go from child to parent
                    setsPortSpot     : false,  // keep Spot.AllSides for link connection spot
                    setsChildPortSpot: false,  // keep Spot.AllSides
                    // nodes not connected by "generalization" links are laid out horizontally
                    arrangement: go.TreeLayout.ArrangementHorizontal,
                }),
        },
    );


    // the item template for properties
    const propertyTemplate = $(
        go.Panel,
        "Horizontal",
        // property visibility/access
        $(
            go.TextBlock,
            {isMultiline: false, editable: false, width: 12},
            new go.Binding("text", "visibility", convertVisibility),
        ),
        // property name, underlined if scope=="class" to indicate static property
        $(
            go.TextBlock,
            {isMultiline: false, editable: true},
            new go.Binding("text", "name").makeTwoWay(),
            new go.Binding("isUnderline", "scope", (s) => s[0] === "c"),
        ),
        // property value, if known
        $(
            go.TextBlock,
            "",
            new go.Binding("text", "type", (t) => (t ? ": " : "")),
        ),
        $(
            go.TextBlock,
            {isMultiline: false, editable: true},
            new go.Binding("text", "type").makeTwoWay(),
        ),
        // property default value, if any
        $(
            go.TextBlock,
            {isMultiline: false, editable: false},
            new go.Binding("text", "default", (s) => s ? ` = ${s}` : ""),
        ),
    );

    // the item template for methods
    const methodTemplate = $(
        go.Panel,
        "Horizontal",
        // method visibility/access
        $(
            go.TextBlock,
            {isMultiline: false, editable: false, width: 12},
            new go.Binding("text", "visibility", convertVisibility),
        ),
        // method name, underlined if scope=="class" to indicate static method
        $(
            go.TextBlock,
            {isMultiline: false, editable: true},
            new go.Binding("text", "name").makeTwoWay(),
            new go.Binding("isUnderline", "scope", (s) => s[0] === "c"),
        ),
        // method parameters
        $(
            go.TextBlock,
            "()",
            // this does not permit adding/editing/removing of parameters via inplace edits
            new go.Binding("text", "parameters", (parr) =>
                `(${parr.map((par: { name: string, type: string }) => `${par.name}: ${par.type}`).join(", ")})`),
        ),
        // method return value, if any
        $(
            go.TextBlock,
            "",
            new go.Binding("text", "type", (t) => (t ? ": " : "")),
        ),
        $(
            go.TextBlock,
            {isMultiline: false, editable: true},
            new go.Binding("text", "type").makeTwoWay(),
        ),
    );

    // this simple template does not have any buttons to permit adding or
    // removing properties or methods, but it could!
    myDiagram.nodeTemplate = $(
        go.Node,
        "Auto",
        {
            locationSpot: go.Spot.Center,
            fromSpot    : go.Spot.AllSides,
            toSpot      : go.Spot.AllSides,
        },
        $(go.Shape, "RoundedRectangle", new go.Binding("fill", "entityType", convertEntityTypeToBGColor)),
        $(
            go.Panel,
            "Table",
            {defaultRowSeparatorStroke: "black"},
            // stereotype
            $(
                go.TextBlock,
                {
                    row        : 0,
                    columnSpan : 2,
                    margin     : 3,
                    alignment  : go.Spot.Center,
                    font       : "italic 12pt sans-serif",
                    isMultiline: false,
                    editable   : true,
                },
                new go.Binding("text", "entityType", (type) => `<<${type.toLowerCase()}>>`),
            ),
            // header
            $(
                go.TextBlock,
                {
                    row        : 1,
                    columnSpan : 2,
                    margin     : 3,
                    alignment  : go.Spot.Center,
                    font       : "bold 12pt sans-serif",
                    isMultiline: false,
                    editable   : true,
                },
                new go.Binding("text", "name").makeTwoWay(),
            ),
            // properties
            $(
                go.TextBlock,
                "Properties",
                {row: 2, font: "italic 10pt sans-serif"},
                new go.Binding("visible", "visible", (v) => !v).ofObject("PROPERTIES"),
            ),
            $(
                go.Panel,
                "Vertical",
                {name: "PROPERTIES"},
                new go.Binding("itemArray", "properties"),
                new go.Binding("background", "entityType", convertEntityTypeToBGColor),
                {
                    row             : 2,
                    margin          : 3,
                    stretch         : go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left,
                    itemTemplate    : propertyTemplate,
                },
            ),
            $(
                "PanelExpanderButton",
                "PROPERTIES",
                {
                    row      : 2,
                    column   : 1,
                    alignment: go.Spot.TopRight,
                    visible  : false,
                },
                new go.Binding("visible", "properties", (arr) => arr.length > 0),
            ),
            // methods
            $(
                go.TextBlock,
                "Methods",
                {row: 3, font: "italic 10pt sans-serif"},
                new go.Binding("visible", "visible", (v) => !v).ofObject("METHODS"),
            ),
            $(
                go.Panel,
                "Vertical",
                {name: "METHODS"},
                new go.Binding("itemArray", "methods"),
                new go.Binding("background", "entityType", convertEntityTypeToBGColor),
                {
                    row             : 3,
                    margin          : 3,
                    stretch         : go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left,
                    itemTemplate    : methodTemplate,
                },
            ),
            $(
                "PanelExpanderButton",
                "METHODS",
                {row: 3, column: 1, alignment: go.Spot.TopRight, visible: false},
                new go.Binding("visible", "methods", (arr) => arr.length > 0),
            ),
        ),
    );

    myDiagram.linkTemplate = $(
        go.Link,
        {routing: go.Link.Orthogonal},
        new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
        $(go.Shape, new go.Binding("strokeDashArray", "relationship", convertDashArrayFromArrow)),
        $(
            go.Shape,
            {scale: 1.3},
            new go.Binding("fill", "relationship", convertColorFromArrow),
            new go.Binding("fromArrow", "relationship", convertFromArrow),
        ),
        $(
            go.Shape,
            {scale: 1.3},
            new go.Binding("fill", "relationship", convertColorFromArrow),
            new go.Binding("toArrow", "relationship", convertToArrow),
        ),
    );

    return myDiagram;
}
