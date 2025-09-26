import { PortfolioRepository } from "./PortfolioRepository";
import { AssetRepository } from "./AssetRepository";
import { UserRepository } from "./UserRepository";
import { MarketDataRepository } from "./MarketDataRepository";
import { Portfolio } from "../../models/Portfolio/Portfolio";
import { Asset } from "../../models/Asset/Asset";
import { User } from "../../models/User/User";
import { MarketData } from "../../models/MarketData/MarketData";

export class FacadeRepository {
  private static instance: FacadeRepository | null = null;

  private PortfolioRepository = new PortfolioRepository();
  private AssetRepository = new AssetRepository();
  private UserRepository = new UserRepository();
  private MarketDataRepository = new MarketDataRepository();

  private constructor() {}

  static getInstance(): FacadeRepository {
    if (!FacadeRepository.instance) {
      FacadeRepository.instance = new FacadeRepository();
    }
    return FacadeRepository.instance;
  }

  // Portfolio
  getPortfolioById(userId: string): Portfolio {
    return this.PortfolioRepository.findByUserIdOrFail(userId);
  }
  getHolding(portfolio: Portfolio, symbol: string) {
    return this.PortfolioRepository.getHolding(portfolio, symbol);
  }

  // Asset
  getAssetBySymbol(symbol: string): Asset {
    return this.AssetRepository.findBySymbolOrFail(symbol);
  }
  updateAssetPrice(symbol: string, newPrice: number): void {
    this.AssetRepository.updateAsset(symbol, newPrice);
  }

  // User
  getUserById(userId: string): User {
    return this.UserRepository.getOneByIdOrFail(userId);
  }
  getAllUsers(): User[] {
    return this.UserRepository.getAllUser();
  }

  // Market Data
  getMarketDataBySymbol(symbol: string): MarketData {
    return this.MarketDataRepository.getOneByIdOrFail(symbol);
  }
  getAllMarketData(): MarketData[] {
    return this.MarketDataRepository.getAllMarketData();
  }
  updateMarketDataPrice(symbol: string, newPrice: number): void {
    this.MarketDataRepository.updateMarketData(symbol, newPrice);
  }
}
