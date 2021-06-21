import {AdvancedDiagramType, DiagramType} from "../../class/common/diagram-type";
import {DiagramModel} from "../../model/diagram-model";
import {DiagramEntityFactory} from "../../class/diagram-entity-factory";
import {DiagramLink} from "../../model/diagram-link";

class BotTypes {
    public static readonly BotId = DiagramType.Link("BotId");
    public static readonly Bot = DiagramType.Link("Bot");
    public static readonly BotType = DiagramType.Link("BotType");
    public static readonly BotActivity = DiagramType.Link("BotActivity");
    public static readonly Bots = DiagramType.LinkArray("Bot");
}

export function addBotItemsToModel(model: DiagramModel): void {
    model.defineType({name: "BotId"});

    model.addEntity(
        DiagramEntityFactory.createEnum("BotType")
            .addPublicFinalProperty("BUILDER", DiagramType.String)
            .addPublicFinalProperty("ARCHER", DiagramType.String)
            .addPublicFinalProperty("WARRIOR", DiagramType.String)
            .build(),
    );

    model.addEntity(
        DiagramEntityFactory.createInterface("MovableItem")
            .addPublicProperty("position", DiagramType.Link("WorldUnit"))
            .build(),
    );

    model.addEntity(
        DiagramEntityFactory.createEnum("BotActivity")
            .addPublicFinalProperty("WALKING", DiagramType.String)
            .addPublicFinalProperty("FIRING", DiagramType.String)
            .addPublicFinalProperty("STANDING", DiagramType.String)
            .addPublicFinalProperty("FLYING", DiagramType.String)
            .addPublicFinalProperty("ATTACKING", DiagramType.String)
            .addPublicFinalProperty("LOOKING_AROUND", DiagramType.String)
            .addPublicFinalProperty("DEAD", DiagramType.String)
            .addPublicFinalProperty("APPROACHING", DiagramType.String)
            .build(),
    );

    model.addEntity(
        DiagramEntityFactory.createInterface("Bot")
            .addPublicFinalProperty("id", BotTypes.BotId)
            .addPublicFinalProperty("type", BotTypes.BotType)
            .addPublicFinalProperty("activity", BotTypes.BotActivity)
            .addPublicFinalProperty("MaxHealth", DiagramType.Number)
            .addPublicFinalProperty("health", DiagramType.Number)
            .build(),
    );


    model.addEntity(
        DiagramEntityFactory.createClass("BotService")
            .addPublicFinalProperty("bots$", AdvancedDiagramType.Observable(BotTypes.Bots))
            .addPublicMethod("addBot", DiagramType.Void, {
                name: "bot",
                type: BotTypes.Bot,
            })
            .addPublicMethod("getBot", AdvancedDiagramType.Observable(BotTypes.Bot), {
                name: "botId",
                type: BotTypes.BotId,
            })
            .addPublicMethod("removeBot", DiagramType.Boolean, {
                name: "botId",
                type: BotTypes.BotId,
            })
            .addPublicMethod(
                "getBotsInside",
                AdvancedDiagramType.Observable(BotTypes.Bots),
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

    model.addLink(DiagramLink.Aggregation("BotService", "Bot"));
    model.addLink(DiagramLink.Composition("Bot", "BotType"));
    model.addLink(DiagramLink.Composition("Bot", "BotActivity"));
    model.addLink(DiagramLink.Realization("MovableItem", "Bot"));
}