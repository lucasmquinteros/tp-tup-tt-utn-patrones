import { IAssetRepository } from "../repositories/IAssetRepository";
import { Asset } from "../../models/Asset/Asset";
import { BaseRepository } from "../BaseRepository";
import { config } from "../../config/config";
//Hace falta heredar baseRepository?
export class AssetRepository
  extends BaseRepository<Asset>
  implements IAssetRepository
{
  private static instance: AssetRepository;

  private constructor() {
    super();
  }
  static getInstance() {
    if (AssetRepository.instance) return AssetRepository.instance;
    return new AssetRepository();
  }
  saveAsset(asset: Asset) {
    this.entities.set(asset.symbol, asset);
  }

  initializeDefaultData(): void {
    config.market.baseAssets.forEach((baseAsset) => {
      const asset = new Asset(
        baseAsset.symbol,
        baseAsset.name,
        baseAsset.basePrice,
        baseAsset.sector
      );
      this.entities.set(baseAsset.symbol, asset);
    });
  }

  findById(symbol: string): Asset {
    const asset: Asset | any = this.entities.get(symbol);
    if (!asset) throw new Error("Asset no encontrado");
    return asset;
  }

  updateAsset(symbol: string, newPrice: number): void {
    const asset = this.findById(symbol);
    asset.currentPrice = newPrice;
    asset.lastUpdated = new Date();
    this.entities.set(symbol, asset);
  }

  getAllAssets(): Asset[] {
    return Array.from(this.entities.values());
  }
}
