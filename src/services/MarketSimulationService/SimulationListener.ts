import {IMarketSimulationService} from "./MarketSimulationService";
import {IAssetRepository} from "../../repository/repositories/IAssetRepository";
import {AssetRepository} from "../../repository/infra/AssetRepository";
import {storage} from "../../utils/storage";
import {config} from "../../config/config";

export interface ISimulationListener {
    updatePortfolios(): void;
    updateAssets(): void;
    updateAll(): void;
}
export class SimulationListener implements ISimulationListener {
    private AssetRepository: IAssetRepository;
    constructor(AssetRepository: IAssetRepository) {
        this.AssetRepository = AssetRepository;
    }

    updateAll(): void {
        const allMarketData = storage.getAllMarketData();

        allMarketData.forEach((marketData) => {
            // Generar cambio aleatorio de precio
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

            storage.updateMarketData(marketData);
            this.AssetRepository.updateAsset(marketData.symbol, newPrice);
        });

        // Actualizar valores de portafolios

    }

    updateAssets(): void {

    }

    updatePortfolios(): void {
    }


}