import { Dependency } from "../src/dependency";
import { BuildingRenderer } from "./building-renderer";


@Dependency({
    purpose: "module",
    require: [BuildingRenderer]
})
export class BuildingsModule {
    public constructor(private readonly buildingRenderer: BuildingRenderer) {
    }
}
