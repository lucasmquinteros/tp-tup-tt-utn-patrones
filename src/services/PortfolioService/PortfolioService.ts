import { Portfolio } from "../../models/Portfolio/Portfolio";
import { FacadeRepository } from "../../repository/infra/FacadeRepository";
import { typeTransaction } from "../TradingServices/ITradingService";
import { Asset } from "../../models/Asset/Asset";

/**
 * Centraliza la lógica de operaciones y recálculo del Portfolio.
 * - Evita duplicación entre servicios/repositorios/modelos.
 * - Permite evolucionar reglas de negocio sin tocar los modelos.
 */
export class PortfolioService {
  private facade: FacadeRepository;

  constructor(facade: FacadeRepository) {
    this.facade = facade;
  }

  // Operaciones sobre holdings (delegan en el modelo para mantener invariante interna)
  addHolding(portfolio: Portfolio, symbol: string, quantity: number, price: number): void {
    portfolio.addHolding(symbol, quantity, price);
  }

  removeHolding(portfolio: Portfolio, symbol: string, quantity: number): boolean {
    return portfolio.removeHolding(symbol, quantity);
  }



  /**
   * Recalcula los valores del portafolio refrescando los precios actuales
   * desde los Assets y luego recalculando los totales.
   */
  recalculatePortfolioValues(portfolio: Portfolio): void {
    portfolio.holdings.forEach((holding) => {
      const asset: Asset = this.facade.getAssetBySymbol(holding.symbol);
      holding.updateCurrentValue(asset.currentPrice);
    });
    portfolio.calculateTotals();
  }

  /**
   * Actualiza el portfolio según el tipo de transacción y luego recalc.
   * Provee una API conveniente para TradingService.
   */
  applyTradeAndRecalculate(
    portfolio: Portfolio,
    symbol: string,
    quantity: number,
    price: number,
    action: typeTransaction
  ): void {
    if (action === typeTransaction.buy) {
      this.addHolding(portfolio, symbol, quantity, price);
    } else {
      this.removeHolding(portfolio, symbol, quantity);
    }
    this.recalculatePortfolioValues(portfolio);
  }
}
