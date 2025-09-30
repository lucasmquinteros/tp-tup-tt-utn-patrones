import {BaseRepository} from "../BaseRepository";
import {MarketData} from "../../models/MarketData/MarketData";
import {config} from "../../config/config";

export class MarketDataRepository extends BaseRepository<MarketData> {
    private marketData: Map<string, MarketData> = new Map();
    static instance: MarketDataRepository;
    constructor() {
        super();
    }
    static getInstance() {
        if(MarketDataRepository.instance) return MarketDataRepository.instance;
        return new MarketDataRepository();
    }

    initializeDefaultData() {
        config.market.baseAssets.forEach(baseAsset => {
            this.marketData.set(baseAsset.symbol, new MarketData(baseAsset.symbol, baseAsset.basePrice))
        })
    }

    findById(symbol: string): MarketData {
        const marketData = this.marketData.get(symbol);
        if(!marketData) throw new Error("MarketData no encontrado");
        return marketData;
    }

    getAllMarketData(): MarketData[] {
        return Array.from(this.marketData.values());
    }

    updateMarketData(symbol: string, newPrice: number): void {
        const marketData = this.findById(symbol);
        const change = newPrice - marketData.price;
        const changePercent = (change / marketData.price) * 100;
        
        marketData.price = newPrice;
        marketData.change = change;
        marketData.changePercent = changePercent;
        marketData.timestamp = new Date();
        
        this.marketData.set(symbol, marketData);
    }
}
