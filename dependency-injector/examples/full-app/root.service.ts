import { Injectable } from "../../src";
import { EntityService } from "./entity.service";
import { LayerService } from "./layer.service";

@Injectable()
export class RootService {
    public constructor(private readonly layerService: LayerService,
                       private readonly entityService: EntityService) {
    }

}
