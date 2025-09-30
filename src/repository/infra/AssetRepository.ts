import { IAssetRepository } from "../repositories/IAssetRepository";
import { Asset } from "../../models/Asset/Asset";
import { BaseRepository } from "../BaseRepository";
import {config} from "../../config/config";
//Hace falta heredar baseRepository?
export class AssetRepository extends BaseRepository<Asset> implements IAssetRepository {
    private assets: Map<string, Asset> = new Map();

    constructor() {
        super();
    }
    saveAsset(asset: Asset) {
        this.assets.set(asset.symbol, asset);
    }

    initializeDefaultData(): void {
        config.market.baseAssets.forEach((baseAsset) => {
            const asset = new Asset(
                baseAsset.symbol,
                baseAsset.name,
                baseAsset.basePrice,
                baseAsset.sector
            );
            this.assets.set(baseAsset.symbol, asset);
        })
    }


    findById(symbol: string): Asset  {
        const asset: Asset | any = this.assets.get(symbol);
        if(!asset) throw new Error("Asset no encontrado");
        return asset;
    }


    updateAsset(symbol: string, newPrice: number): void {
        const asset = this.findById(symbol);
        asset.currentPrice = newPrice;
        asset.lastUpdated = new Date();
        this.assets.set(symbol, asset);
    }

    getAllAssets(): Asset[] {
        return Array.from(this.assets.values());
    }
}
