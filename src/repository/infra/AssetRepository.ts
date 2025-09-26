import { storage } from "../../utils/storage";
import { IAssetRepository } from "../repositories/IAssetRepository";
import { Asset } from "../../models/Asset/Asset";
import { BaseRepository } from "../BaseRepository";
//Hace falta heredar baseRepository?
export class AssetRepository extends BaseRepository<Asset> implements IAssetRepository {
    private assets: Map<string, Asset> = new Map();

    constructor() {
        super();
        this.initializeDefaultAssets();
    }

    private initializeDefaultAssets() {
        config.market.baseAssets.forEach(baseAsset => {
            const asset = new Asset(baseAsset.symbol, baseAsset.name, baseAsset.basePrice, baseAsset.sector);
            this.assets.set(baseAsset.symbol, asset);
        });
    }

    findById(symbol: string): Asset | null {
        return this.assets.get(symbol) || null;
    }

    findBySymbol(symbol: string): Asset | null {
        return this.findById(symbol);
    }

    findBySymbolOrFail(symbol: string): Asset {
        const asset = this.findById(symbol);
        if (!asset) throw new Error("Activo no encontrado");
        return asset;
    }

    updateAsset(symbol: string, newPrice: number): void {
        const asset = this.findBySymbolOrFail(symbol);
        asset.currentPrice = newPrice;
        asset.lastUpdated = new Date();
        this.assets.set(symbol, asset);
    }

    getAllAssets(): Asset[] {
        return Array.from(this.assets.values());
    }
}
