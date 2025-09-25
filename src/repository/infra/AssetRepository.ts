import { storage } from "../../utils/storage";
import {IAssetRepository} from "../repositories/IAssetRepository";
import {Asset} from "../../models/Asset/Asset";
import {BaseRepository} from "../BaseRepository";
//Hace falta heredar baseRepository?
export class AssetRepository extends BaseRepository<Asset> implements IAssetRepository {
    saveAsset(asset: Asset): void {
        storage.updateAsset(asset);
    }
    updateAsset(symbol: string, newPrice: number): void {
        const asset = this.findBySymbolOrFail(symbol)
        asset.currentPrice = newPrice;
        asset.lastUpdated = new Date();
        this.saveAsset(asset);

    }
    findById(symbol: string): Asset | null {
        return storage.getAssetBySymbol(symbol) ?? null;
    }

    findBySymbol(symbol: string): Asset | null {
        return this.findById(symbol);
    }

    findBySymbolOrFail(symbol: string): Asset {
        const asset = this.findById(symbol);
        if (!asset) throw new Error("Activo no encontrado");
        return asset;
    }

}
