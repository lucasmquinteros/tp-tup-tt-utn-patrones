//implementar iportfolio
import { IPortfolioRepository } from "../repositories/IPortfolioRepository";
import { Portfolio } from "../../models/Portfolio/Portfolio";
import { BaseRepository } from "../BaseRepository";
import { PortfolioHolding } from "../../models/Portfolio/PortfolioHolding";
import { User } from "../../models/User/User";
import { PortfolioService } from "../../services/PortfolioService/PortfolioService";
import { UserRepository } from "./UserRepository";

export class PortfolioRepository extends BaseRepository<Portfolio> {
  private static instance: PortfolioRepository;
  private constructor() {
    super();
    this.initializeDefaultData();
  }
  static getInstance() {
    if (PortfolioRepository.instance) return PortfolioRepository.instance;
    PortfolioRepository.instance = new PortfolioRepository();
    return PortfolioRepository.instance;
  }

  initializeDefaultData() {
    const defaultUsers = UserRepository.getInstance().getAllUsers();
    defaultUsers.forEach((user) => {
      const portfolio = new Portfolio(user.id);
      this.entities.set(user.id, portfolio);
    });
  }

  updatePortfolio(portfolio: Portfolio): void {
    this.entities.set(portfolio.userId, portfolio);
  }
  findById(id: string): Portfolio {
    const portfolio = this.entities.get(id);
    if (!portfolio) throw new Error("Portfolio no encontrado");
    return portfolio;
  }

  getHolding(portfolio: Portfolio, symbol: string): PortfolioHolding {
    const holding = portfolio.holdings.find(
      (holding) => holding.symbol === symbol
    );
    if (!holding) throw new Error("Holding no encontrado");
    return holding;
  }
  updateAllPortfolios(allUsers: User[], service: PortfolioService): void {
    allUsers.forEach((user) => {
      if (user) {
        const portfolio = this.findById(user.id);
        service.recalculatePortfolioValues(portfolio);
        this.updatePortfolio(portfolio);
      }
    });
  }
  updatePortfolioValues(userId: string, marketData: Map<string, number>): void {
    const portfolio = this.findById(userId);
    if (!portfolio) return;

    portfolio.holdings.forEach((holding) => {
      const currentPrice = marketData.get(holding.symbol);
      if (currentPrice !== undefined) {
        portfolio.updateHoldingValue(holding.symbol, currentPrice);
      }
    });

    this.updatePortfolio(portfolio);
  }

  getAllPortfolios(): Portfolio[] {
    return Array.from(this.entities.values());
  }
}
