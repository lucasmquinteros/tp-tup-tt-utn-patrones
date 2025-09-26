//implementar iportfolio
import {IPortfolioRepository} from "../repositories/IPortfolioRepository";
import {Portfolio} from "../../models/Portfolio/Portfolio";
import {storage} from "../../utils/storage";
import {BaseRepository} from "../BaseRepository";
import {PortfolioHolding} from "../../models/Portfolio/PortfolioHolding";
import { User } from "../../models/User/User";

export class PortfolioRepository extends BaseRepository<Portfolio>{
    private portfolios: Map<string, Portfolio> = new Map();

    updatePortfolio(portfolio: Portfolio): void {
    this.portfolios.set(portfolio.userId, portfolio);
  }
    findById(id: string): Portfolio{
        const portfolio =  this.portfolios.get(id);
        if(!portfolio)  throw new Error("Portfolio no encontrado");
        return portfolio;
    }

    
    getHolding(portfolio: Portfolio, symbol: string): PortfolioHolding {
        const holding =  portfolio.holdings.find(holding => holding.symbol === symbol);
        if(!holding) throw new Error("Holding no encontrado");
        return holding;
    }
    updateAllPortfolios(allUsers: User[]): void {
        allUsers.forEach((user) => {
            if (user) {
                const portfolio = this.findById(user.id);
                Portfolio.recalculatePortfolioValues(portfolio);
                this.updatePortfolio(portfolio);
            
                }
        });
    }
    updatePortfolioValues(userId: string, marketData: Map<string, number>): void {
        const portfolio = this.findById(userId);
        if (!portfolio) return;

        portfolio.holdings.forEach(holding => {
            const currentPrice = marketData.get(holding.symbol);
            if (currentPrice !== undefined) {
                portfolio.updateHoldingValue(holding.symbol, currentPrice);
            }
        });

        this.updatePortfolio(portfolio);
    }

    getAllPortfolios(): Portfolio[] {
        return Array.from(this.portfolios.values());
    }
}
