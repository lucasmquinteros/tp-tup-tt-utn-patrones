import { IMarketSimulationService } from "./MarketSimulationService";
import { IAssetRepository } from "../../repository/repositories/IAssetRepository";
import { AssetRepository } from "../../repository/infra/AssetRepository";
import { storage } from "../../utils/storage";
import { config } from "../../config/config";
import { FacadeRepository } from "../../repository/infra/FacadeRepository";

export interface ISimulationListener {
  updatePortfolios(): void;
  updateAssets(): void;
  updateAll(): void;
}
export class SimulationListener implements ISimulationListener {
  private FacadeRepository: FacadeRepository;
  constructor(facadeRepository: FacadeRepository) {
    this.FacadeRepository = facadeRepository;
  }

  updateAll(): void {
    const allMarketData = this.FacadeRepository.getAllMarketData();
    const marketPrices = new Map<string, number>();

    // Actualizar precios de mercado
    allMarketData.forEach((marketData) => {
      const randomChange = (Math.random() - 0.5) * 2;
      const volatilityFactor = config.market.volatilityFactor;
      const priceChange = marketData.price * randomChange * volatilityFactor;
      const newPrice = Math.max(marketData.price + priceChange, 0.01);

      marketPrices.set(marketData.symbol, newPrice);
      this.FacadeRepository.updateMarketDataPrice(marketData.symbol, newPrice);
      this.FacadeRepository.updateAssetPrice(marketData.symbol, newPrice);
    });

    // Actualizar portfolios
    const portfolios = this.FacadeRepository.getAllPortfolios();
    portfolios.forEach((portfolio) => {
      portfolio.holdings.forEach((holding) => {
        const price = marketPrices.get(holding.symbol);
        if (price !== undefined) {
          portfolio.updateHoldingValue(holding.symbol, price);
        }
      });
    });
  }

  updateAssets(): void {}

  updatePortfolios(): void {
    // Obtener todos los usuarios y actualizar sus portafolios
  }

  // Recalcular valores del portafolio
}
