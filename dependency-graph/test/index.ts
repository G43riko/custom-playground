import { DependencyData } from "../src/dependency-graph";
import { BuildingRenderer } from "./building-renderer";
import { BuildingsModule } from "./buildings-module";

console.log(new BuildingsModule(new BuildingRenderer()));

DependencyData.print()
