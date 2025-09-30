// Servicios de trading
import {config} from "../../config/config";
import {Portfolio} from "../../models/Portfolio/Portfolio";
import {Transaction} from "../../models/Transaction/Transaction";
import {ITradingService, typeTransaction} from "./ITradingService";
import {FacadeRepository} from "../../repository/infra/FacadeRepository";
import { PortfolioService } from "../PortfolioService/PortfolioService";

export class TradingService implements  ITradingService{
    private facade: FacadeRepository;
    private portfolioService: PortfolioService;
    constructor(facade: FacadeRepository) {
        this.facade = facade;
        this.portfolioService = new PortfolioService(facade);
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
            this.facade.updateUser(user);



            this.updatePortfolio(userId, symbol, quantity, executionPrice, type);


            this.facade.saveTransaction(transaction);

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
        this.portfolioService.applyTradeAndRecalculate(portfolio, symbol, quantity, price, action);
        this.facade.updatePortfolio(portfolio);
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
    return this.facade.getTransactionsByUserId(userId);
  }
}
