import { FacadeRepository } from "../../repository/infra/FacadeRepository";
import {MarketData} from "../../models/MarketData/MarketData";
import {config} from "../../config/config";

export interface ISimulationListener {
  update(): void;
}
export class ObserverMarketData implements ISimulationListener {
    private portfolioListener: ObserverPortfolios = new ObserverPortfolios();
    private assetListener: ObserverAssets = new ObserverAssets();
    update(): void {
        const marketData: MarketData[] = FacadeRepository.getInstance().getAllMarketData();
        marketData.forEach((marketData: MarketData) => {
            const randomChange = (Math.random() - 0.5) * 2; // -1 a +1
            const volatilityFactor = config.market.volatilityFactor;
            const priceChange = marketData.price * randomChange * volatilityFactor;

            const newPrice = Math.max(marketData.price + priceChange, 0.01); // Evitar precios negativos
            const change = newPrice - marketData.price;
            const changePercent = (change / marketData.price) * 100;

            // Actualizar datos de mercado
            marketData.price = newPrice;
            marketData.change = change;
            marketData.changePercent = changePercent;
            marketData.volume += Math.floor(Math.random() * 10000); // Simular volumen
            marketData.timestamp = new Date();
            FacadeRepository.getInstance().updateMarketDataPrice(marketData.symbol, newPrice);
        })
        this.assetListener.update();
        this.portfolioListener.update();

    }
}


export class ObserverPortfolios implements ISimulationListener{
    update(): void {
        const marketData: MarketData[] = FacadeRepository.getInstance().getAllMarketData();
        const portfolios = FacadeRepository.getInstance().getAllPortfolios();
        portfolios.forEach(portfolio => {
            portfolio.holdings.forEach(holding => {
                const price = marketData.find(data => data.symbol === holding.symbol)?.price;
                if (!price) return;
                portfolio.updateHoldingValue(holding.symbol, price);
            });
        });
    }
}

export class ObserverAssets implements ISimulationListener {
    update(): void {
        const marketData: MarketData[] = FacadeRepository.getInstance().getAllMarketData();
        marketData.forEach(({symbol, price}: MarketData) => {
            FacadeRepository.getInstance().updateAssetPrice(symbol, price);
        });
    }
}