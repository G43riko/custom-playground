const diagramData = "{ \"class\": \"GraphLinksModel\",\n  \"copiesArrays\": true,\n  \"copiesArrayObjects\": true,\n  \"nodeDataArray\": [\n{\"key\":1,\"name\":\"BotType\",\"entityType\":\"ENUM\",\"properties\":[{\"name\":\"BUILDER\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"ARCHER\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"WARRIOR\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"}]},\n{\"key\":2,\"name\":\"MovableItem\",\"entityType\":\"INTERFACE\",\"properties\":[{\"name\":\"position\",\"type\":\"WorldUnit\",\"visibility\":\"PUBLIC\"}]},\n{\"key\":3,\"name\":\"BotActivity\",\"entityType\":\"ENUM\",\"properties\":[{\"name\":\"WALKING\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"FIRING\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"STANDING\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"FLYING\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"ATTACKING\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"LOOKING_AROUND\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"DEAD\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"},{\"name\":\"APPROACHING\",\"type\":\"STRING\",\"visibility\":\"PUBLIC\"}]},\n{\"key\":4,\"name\":\"Bot\",\"entityType\":\"INTERFACE\",\"properties\":[{\"name\":\"id\",\"type\":\"BotId\",\"visibility\":\"PUBLIC\"},{\"name\":\"type\",\"type\":\"BotType\",\"visibility\":\"PUBLIC\"},{\"name\":\"activity\",\"type\":\"BotActivity\",\"visibility\":\"PUBLIC\"},{\"name\":\"MaxHealth\",\"type\":\"NUMBER\",\"visibility\":\"PUBLIC\"},{\"name\":\"health\",\"type\":\"NUMBER\",\"visibility\":\"PUBLIC\"}]},\n{\"key\":5,\"methods\":[{\"name\":\"addBot\",\"entityType\":\"CLASS\",\"type\":\"VOID\",\"parameters\":[{\"name\":\"bot\",\"type\":\"Bot\"}],\"visibility\":\"PUBLIC\"},{\"name\":\"getBot\",\"entityType\":\"CLASS\",\"type\":\"Observable<Bot>\",\"parameters\":[{\"name\":\"botId\",\"type\":\"BotId\"}],\"visibility\":\"PUBLIC\"},{\"name\":\"removeBot\",\"entityType\":\"CLASS\",\"type\":\"BOOLEAN\",\"parameters\":[{\"name\":\"botId\",\"type\":\"BotId\"}],\"visibility\":\"PUBLIC\"},{\"name\":\"getBotsInside\",\"entityType\":\"CLASS\",\"type\":\"Observable<(Bot)[]>\",\"parameters\":[{\"name\":\"range\",\"type\":\"Range<WorldUnit>\"},{\"name\":\"wholeInside\",\"type\":\"BOOLEAN\"}],\"visibility\":\"PUBLIC\"}],\"name\":\"BotService\",\"entityType\":\"CLASS\",\"properties\":[{\"name\":\"bots$\",\"type\":\"Observable<(Bot)[]>\",\"visibility\":\"PUBLIC\"}]}\n],\n  \"linkDataArray\": [\n{\"to\":5,\"from\":4,\"relationship\":\"AGGREGATION\"},\n{\"to\":4,\"from\":1,\"relationship\":\"COMPOSITION\"},\n{\"to\":4,\"from\":3,\"relationship\":\"COMPOSITION\"},\n{\"to\":2,\"from\":4,\"relationship\":\"REALIZATION\"}\n]}"