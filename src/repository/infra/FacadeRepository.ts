import { PortfolioRepository } from "./PortfolioRepository";
import { AssetRepository } from "./AssetRepository";
import { UserRepository } from "./UserRepository";
import { MarketDataRepository } from "./MarketDataRepository";
import { Portfolio } from "../../models/Portfolio/Portfolio";
import { Asset } from "../../models/Asset/Asset";
import { User } from "../../models/User/User";
import { MarketData } from "../../models/MarketData/MarketData";
import {TransactionRepository} from "./TransactionRepository";
import {Transaction} from "../../models/Transaction/Transaction";

export class FacadeRepository {
  private static instance: FacadeRepository | null = null;

  private PortfolioRepository = new PortfolioRepository();
  private AssetRepository = new AssetRepository();
  private UserRepository = UserRepository.getInstance();
  private MarketDataRepository = new MarketDataRepository();
  private TransactionRepository = new TransactionRepository();

  private constructor() {}

  static getInstance(): FacadeRepository {
    if (!FacadeRepository.instance) {
      FacadeRepository.instance = new FacadeRepository();
    }
    return FacadeRepository.instance;
  }
  updateUser(user: User): void {
    this.UserRepository.updateUser(user);
  }
  updatePortfolio(portfolio: Portfolio): void {
      this.PortfolioRepository.updatePortfolio(portfolio);
  }

  saveTransaction(transaction: Transaction): void {
      this.TransactionRepository.saveTransaction(transaction);
  }
  getTransactionsByUserId(userId: string): Transaction[] {
    return this.TransactionRepository.getTransactionsByUserId(userId);
  }

  // Portfolio
  getPortfolioById(userId: string): Portfolio {
    return this.PortfolioRepository.findById(userId);
  }
  getHolding(portfolio: Portfolio, symbol: string) {
    return this.PortfolioRepository.getHolding(portfolio, symbol);
  }

  // Asset
  getAssetBySymbol(symbol: string): Asset {
    return this.AssetRepository.findById(symbol);
  }
  updateAssetPrice(symbol: string, newPrice: number): void {
    this.AssetRepository.updateAsset(symbol, newPrice);
  }

  // User
  getUserById(userId: string): User {
    return this.UserRepository.getOneByIdOrFail(userId);
  }
  getAllUsers(): User[] {
    return this.UserRepository.getAllUsers();
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
