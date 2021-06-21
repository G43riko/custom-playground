import {DiagramModel} from "../../model/diagram-model";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {AdvancedDiagramType, DiagramType} from "../../class/common/diagram-type";
import {DiagramLink} from "../../model/diagram-link";

class BuildingTypes {
    public static readonly BuildingId = DiagramType.Link("BuildingId");
    public static readonly Building = DiagramType.Link("Building");
    public static readonly BuildingType = DiagramType.Link("BuildingType");
    public static readonly BuildingActivity = DiagramType.Link("BuildingActivity");
    public static readonly Buildings = DiagramType.LinkArray("Building");
}

export function addBuildingItemsToModel(model: DiagramModel): void {
    model.defineType({name: "BuildingId"});

    model.addEntity(
        DiagramEntityFactory.createEnum("BuildingType")
            .addPublicFinalProperty("TOWN_HALL", DiagramType.String)
            .addPublicFinalProperty("LUMBER_JACK", DiagramType.String)
            .addPublicFinalProperty("HOUSE", DiagramType.String)
            .build(),
    );

    model.addEntity(
        DiagramEntityFactory.createEnum("BuildingActivity")
            .addPublicFinalProperty("STANDING", DiagramType.String)
            .addPublicFinalProperty("FIRING", DiagramType.String)
            .addPublicFinalProperty("CONSTRUCTING", DiagramType.String)
            .build(),
    );

    model.addEntity(
        DiagramEntityFactory.createInterface("Building")
            .addPublicFinalProperty("id", BuildingTypes.BuildingId)
            .addPublicFinalProperty("type", BuildingTypes.BuildingType)
            .addPublicFinalProperty("activity", BuildingTypes.BuildingActivity)
            .addPublicFinalProperty("MaxHealth", DiagramType.Number)
            .addPublicFinalProperty("health", DiagramType.Number)
            .build(),
    );

    model.addEntity(
        DiagramEntityFactory.createClass("BuildingService")
            .addPublicFinalProperty("buildings$", AdvancedDiagramType.Observable(BuildingTypes.Buildings))
            .addPublicMethod("addBuilding", DiagramType.Void, {
                name: "building",
                type: BuildingTypes.Building,
            })
            .addPublicMethod("getBuilding", AdvancedDiagramType.Observable(BuildingTypes.Building), {
                name: "buildingId",
                type: BuildingTypes.BuildingId,
            })
            .addPublicMethod("removeBuilding", DiagramType.Boolean, {
                name: "buildingId",
                type: BuildingTypes.BuildingId,
            })
            .addPublicMethod(
                "getBuildingsInside",
                AdvancedDiagramType.Observable(BuildingTypes.Buildings),
                {
                    name: "range",
                    type: DiagramType.LinkGeneric("Range", {name: "WorldUnit"}),
                },
                {
                    name: "wholeInside",
                    type: DiagramType.Boolean,
                    defaultValue: "true",
                },
            ).build(),
    );

    model.addLink(DiagramLink.Aggregation("BuildingService", "Building"));
    model.addLink(DiagramLink.Composition("Building", "BuildingType"));
    model.addLink(DiagramLink.Composition("Building", "BuildingActivity"));
}
