import {Asset} from "../../models/Asset/Asset";
import {BaseRepository} from "../BaseRepository";
export interface IAssetRepository extends BaseRepository<Asset>{
    findBySymbol(symbol: string): Asset | null;
}
