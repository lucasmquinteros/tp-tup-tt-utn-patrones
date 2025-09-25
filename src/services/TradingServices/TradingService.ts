// Servicios de trading
import {storage} from "../../utils/storage";
import {config} from "../../config/config";
import {Portfolio} from "../../models/Portfolio/Portfolio";
import {PortfolioHolding} from "../../models/Portfolio/PortfolioHolding";
import {Transaction} from "../../models/Transaction/Transaction";
import {ITradingService, typeTransaction} from "./ITradingService";
import {FacadeRepository} from "../../repository/infra/FacadeRepository";
import {Asset} from "../../models/Asset/Asset";

export class TradingService implements  ITradingService{
    private facade: FacadeRepository;
    constructor(facade: FacadeRepository) {
        this.facade = facade;
    }
    private async executeOrder(
    userId: string,
    symbol: string,
    quantity: number,
    type: typeTransaction){
        {

            const user = this.facade.getUserById(userId);


            const asset = this.facade.getAssetBySymbol(symbol);


            const executionPrice = asset.currentPrice;

            const grossAmount = quantity * executionPrice;
            const fees = this.calculateFees(grossAmount, type);
            const netAmount = grossAmount - fees;


            const transactionId = this.generateTransactionId();
            const transaction = new Transaction(
                transactionId,
                userId,
                type,
                symbol,
                quantity,
                executionPrice,
                fees
            );


            transaction.complete();


            user.addBalance(netAmount);
            storage.updateUser(user);


            this.updatePortfolio(userId, symbol, quantity, executionPrice, type);


            storage.addTransaction(transaction);

            this.simulateMarketImpact(symbol, quantity, type);

            return transaction;
        }
    }
  // Ejecutar orden de compra al precio de mercado
  async executeBuyOrder(
    userId: string,
    symbol: string,
    quantity: number
  ): Promise<Transaction> {
    return this.executeOrder(userId, symbol, quantity, typeTransaction.buy);
  }

  // Ejecutar orden de venta al precio de mercado
  async executeSellOrder(
    userId: string,
    symbol: string,
    quantity: number
  ): Promise<Transaction> {
        return this.executeOrder(userId, symbol, quantity, typeTransaction.sell);

  }

  // Cálculo de comisiones
  private calculateFees(amount: number, type: typeTransaction): number {
    const feePercentage =
      type === typeTransaction.buy
        ? config.tradingFees.buyFeePercentage
        : config.tradingFees.sellFeePercentage;
    const calculatedFee = amount * feePercentage;
    return Math.max(calculatedFee, config.tradingFees.minimumFee);
  }
  //refactorizacion de actualizar portafolio
    private updatePortfolio(userId: string, symbol: string, quantity: number, price: number, action: typeTransaction){
        const portfolio: Portfolio = this.facade.getPortfolioById(userId);
        (action === typeTransaction.buy ? portfolio.addHolding(symbol, quantity, price) : portfolio.removeHolding(symbol, quantity))
        this.recalculatePortfolioValues(portfolio);
        storage.updatePortfolio(portfolio);

    }

  // Recalcular valores del portafolio
  private recalculatePortfolioValues(portfolio: Portfolio): void {
    // Actualizar el valor actual de cada holding
    portfolio.holdings.forEach((holding) => {
      const asset: Asset = this.facade.getAssetBySymbol(holding.symbol);

      holding.updateCurrentValue(asset.currentPrice);
    });

    // Calcular totales del portafolio
    portfolio.calculateTotals();
  }

  // Simulación de impacto en el mercado después de una operación
  private simulateMarketImpact(
    symbol: string,
    quantity: number,
    action: typeTransaction
  ): void {
    const marketData = this.facade.getMarketDataBySymbol(symbol)

    // Calcular impacto basado en volumen
    const impactFactor = quantity / 1000000; // Factor arbitrario
    const priceImpact = marketData.price * impactFactor * 0.001;

    const newPrice =
      action === typeTransaction.buy
        ? marketData.price + priceImpact
        : marketData.price - priceImpact;


    // Actualizar asset también
    this.facade.updateAssetPrice(symbol, newPrice);

   this.facade.updateMarketDataPrice(symbol, newPrice)
  }

  // Generar ID único para transacciones
  private generateTransactionId(): string {
    return "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Obtener historial de transacciones
  getTransactionHistory(userId: string): Transaction[] {
    return storage.getTransactionsByUserId(userId);
  }
}
