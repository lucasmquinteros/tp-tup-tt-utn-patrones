// Servicios de trading
import {storage} from "../../utils/storage";
import {config} from "../../config/config";
import {Portfolio} from "../../models/Portfolio/Portfolio";
import {PortfolioHolding} from "../../models/Portfolio/PortfolioHolding";
import {Transaction} from "../../models/Transaction/Transaction";
import {ITradingService, typeTransaction} from "./ITradingService";
import {UserRepository} from "../../repository/infra/UserRepository";
import {AssetRepository} from "../../repository/infra/AssetRepository";
import {PortfolioRepository} from "../../repository/infra/PortfolioRepository";
import {Asset} from "../../models/Asset/Asset";

export class TradingService implements  ITradingService{
    private userRepo: UserRepository;
    private assetRepo:AssetRepository;
    private portfolioRepo: PortfolioRepository;
    constructor(userRepo: UserRepository, assetRepo: AssetRepository, portfolioRepo: PortfolioRepository) {
        this.userRepo = userRepo;
        this.assetRepo =    assetRepo;
        this.portfolioRepo = portfolioRepo;
    }
    private async executeOrder(
    userId: string,
    symbol: string,
    quantity: number,
    type: typeTransaction){
        {

            const user = this.userRepo.getOneByIdOrFail(userId);


            const asset = this.assetRepo.findBySymbolOrFail(symbol);


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
        const portfolio: Portfolio = this.portfolioRepo.getOneByIdOrFail(userId);
        (action === typeTransaction.buy ? portfolio.addHolding(symbol, quantity, price) : portfolio.removeHolding(symbol, quantity))
        this.recalculatePortfolioValues(portfolio);
        storage.updatePortfolio(portfolio);

    }

  // Recalcular valores del portafolio
  private recalculatePortfolioValues(portfolio: Portfolio): void {
    // Actualizar el valor actual de cada holding
    portfolio.holdings.forEach((holding) => {
      const asset: Asset = this.assetRepo.getOneByIdOrFail(holding.symbol);

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
    const marketData = storage.getMarketDataBySymbol(symbol);
    if (!marketData) return;

    // Calcular impacto basado en volumen
    const impactFactor = quantity / 1000000; // Factor arbitrario
    const priceImpact = marketData.price * impactFactor * 0.001;

    const newPrice =
      action === typeTransaction.buy
        ? marketData.price + priceImpact
        : marketData.price - priceImpact;

    const change = newPrice - marketData.price;
    const changePercent = (change / marketData.price) * 100;

    marketData.price = newPrice;
    marketData.change = change;
    marketData.changePercent = changePercent;
    marketData.timestamp = new Date();

    // Actualizar asset también
    this.assetRepo.updateAsset(symbol, newPrice);

    storage.updateMarketData(marketData);
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
