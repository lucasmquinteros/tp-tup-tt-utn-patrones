import { storage } from "../../utils/storage";
import { PortfolioHolding } from "./PortfolioHolding";

export class Portfolio {
  userId: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  percentageReturn: number;
  lastUpdated: Date;

  constructor(userId: string) {
    this.userId = userId;
    this.holdings = [];
    this.totalValue = 0;
    this.totalInvested = 0;
    this.totalReturn = 0;
    this.percentageReturn = 0;
    this.lastUpdated = new Date();
  }

  addHolding(symbol: string, quantity: number, price: number): void {
    const existingHolding = this.holdings.find((h) => h.symbol === symbol);

    if (existingHolding) {
      existingHolding.addShares(quantity, price);
    } else {
      const newHolding = new PortfolioHolding(symbol, quantity, price);
      this.holdings.push(newHolding);
    }

    this.lastUpdated = new Date();
  }

  removeHolding(symbol: string, quantity: number): boolean {
    const holding = this.holdings.find((h) => h.symbol === symbol);

    if (!holding || holding.quantity < quantity) {
      return false;
    }

    holding.removeShares(quantity);

    if (holding.quantity === 0) {
      this.holdings = this.holdings.filter((h) => h.symbol !== symbol);
    }

  w  this.lastUpdated = new Date();
    return true;
  }

  calculateTotals(): void {
    let totalValue = 0;
    let totalInvested = 0;

    this.holdings.forEach((holding) => {
      const invested = holding.quantity * holding.averagePrice;
      totalValue += holding.currentValue;
      totalInvested += invested;
    });

    this.totalValue = totalValue;
    this.totalInvested = totalInvested;
    this.totalReturn = totalValue - totalInvested;
    this.percentageReturn =
      totalInvested > 0 ? (this.totalReturn / totalInvested) * 100 : 0;
    this.lastUpdated = new Date();
  }
  recalculatePortfolioValues(portfolio: any): void {
    let totalValue = 0;
    let totalInvested = 0;

    portfolio.holdings.forEach((holding: any) => {
      const asset = storage.getAssetBySymbol(holding.symbol);
      if (asset) {
        holding.currentValue = holding.quantity * asset.currentPrice;
        const invested = holding.quantity * holding.averagePrice;
        holding.totalReturn = holding.currentValue - invested;
        holding.percentageReturn =
          invested > 0 ? (holding.totalReturn / invested) * 100 : 0;

        totalValue += holding.currentValue;
        totalInvested += invested;
      }
    });

    portfolio.totalValue = totalValue;
    portfolio.totalInvested = totalInvested;
    portfolio.totalReturn = totalValue - totalInvested;
    portfolio.percentageReturn =
      totalInvested > 0 ? (portfolio.totalReturn / totalInvested) * 100 : 0;
    portfolio.lastUpdated = new Date();
  }
}
