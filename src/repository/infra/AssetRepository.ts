import { storage } from "../../utils/storage";
import {IAssetRepository} from "../repositories/IAssetRepository";
import {Asset} from "../../models/Asset/Asset";
import {BaseRepository} from "../BaseRepository";
export class AssetRepository extends BaseRepository<Asset> implements IAssetRepository {
    findById(id: string): Asset | null {
        return this.findBySymbol(id);
    }
    findBySymbol(symbol: string): Asset | null {
        return storage.getAssetBySymbol(symbol) ?? null;
    }
    findBySymbolOrFail(symbol: string): Asset {
        const asset = this.findBySymbol(symbol);
        if (!asset) throw new Error("Activo no encontrado");
        return asset;
    }
}
