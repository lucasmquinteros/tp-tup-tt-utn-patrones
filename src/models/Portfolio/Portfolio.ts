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

    this.lastUpdated = new Date();
    return true;
  }

  updateHoldingValue(symbol: string, currentPrice: number): void {
    const holding = this.holdings.find((h) => h.symbol === symbol);
    if (holding) {
      holding.updateCurrentValue(currentPrice);
      this.calculateTotals();
    }
  }

  calculateTotals(): void {
    this.totalValue = this.holdings.reduce(
      (sum, holding) => sum + holding.getCurrentValue(),
      0
    );
    this.totalInvested = this.holdings.reduce(
      (sum, holding) => sum + holding.getInvestedAmount(),
      0
    );
    this.totalReturn = this.totalValue - this.totalInvested;
    this.percentageReturn =
      this.totalInvested > 0 ? (this.totalReturn / this.totalInvested) * 100 : 0;
    this.lastUpdated = new Date();
  }
}
