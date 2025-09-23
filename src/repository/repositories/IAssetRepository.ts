import {Asset} from "../../models/Asset/Asset";
import {BaseRepository} from "../BaseRepository";
export interface IAssetRepository extends BaseRepository<Asset>{

    saveAsset(asset: Asset): void;
    updateAsset(symbol:string, currentPrice: number): void;
}
