import { IMarketSimulationService } from "./MarketSimulationService";
import { IAssetRepository } from "../../repository/repositories/IAssetRepository";
import { AssetRepository } from "../../repository/infra/AssetRepository";
import { config } from "../../config/config";
import { FacadeRepository } from "../../repository/infra/FacadeRepository";
import {Portfolio} from "../../models/Portfolio/Portfolio";

export interface IListenerPortfolio {
    updatePortfolios(marketPrices: Map<string, number>): void;
}
export interface IListenerAsset {
    updateAssets(marketPrices: Map<string, number>): void;
}

export interface ISimulationListener {
  update(): void;
}
abstract class AdapterListeners
    implements ISimulationListener, IListenerPortfolio, IListenerAsset {
    private simulationListenerPortfolios: IListenerPortfolio = new SimulationListenerPortfolios();
    private simulationListenerAssets: IListenerAsset = new SimulationListenerAssets();

    update(): void {
        const allMarketData = FacadeRepository.getInstance().getAllMarketData();
        const marketPrices = new Map<string, number>();

        allMarketData.forEach((data) => {
            const newPrice = Math.max(data.price + (Math.random() - 0.5) * 2 * config.market.volatilityFactor * data.price, 0.01);
            marketPrices.set(data.symbol, newPrice);
            FacadeRepository.getInstance().updateMarketDataPrice(data.symbol, newPrice);
        });

        this.updatePortfolios(marketPrices);
        this.updateAssets(marketPrices);
    }

    updatePortfolios(marketPrices: Map<string, number>): void {
        this.simulationListenerPortfolios.updatePortfolios(marketPrices);
    }
    updateAssets(marketPrices: Map<string, number>): void {
        this.simulationListenerAssets.updateAssets(marketPrices);
    }
}

export class SimulationListenerPortfolios implements IListenerPortfolio{
    updatePortfolios(marketPrices: Map<string, number>): void {
        const portfolios = FacadeRepository.getInstance().getAllPortfolios();
        portfolios.forEach(portfolio => {
            portfolio.holdings.forEach(holding => {
                const price = marketPrices.get(holding.symbol);
                if (price) {
                    portfolio.updateHoldingValue(holding.symbol, price);
                }
            });
        });
    }
}

export class SimulationListenerAssets implements IListenerAsset {
    updateAssets(marketPrices: Map<string, number>): void {
        marketPrices.forEach((price, symbol) => {
            FacadeRepository.getInstance().updateAssetPrice(symbol, price);
        });
    }
}