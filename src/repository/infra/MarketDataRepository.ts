import {BaseRepository} from "../BaseRepository";
import {MarketData} from "../../models/MarketData/MarketData";
import {storage} from "../../utils/storage";

export class MarketDataRepository extends BaseRepository<MarketData>{
    findById(symbol: string): MarketData {
        const marketData = storage.getMarketDataBySymbol(symbol)
        if(!marketData) throw new Error("MarketData no encontrado");
        return marketData;
    }
    getAllMarketData(): MarketData[] {
        return storage.getAllMarketData();
    }

    updateMarketData(symbol: string, newPrice: number):void  {
        const marketData = this.findById(symbol);
        const change = newPrice - marketData.price;
        const changePercent = (change / marketData.price) * 100;
        marketData.price = newPrice;
        marketData.change = change;
        marketData.changePercent = changePercent;
        marketData.timestamp = new Date();
        storage.updateMarketData(marketData);
    }
}
