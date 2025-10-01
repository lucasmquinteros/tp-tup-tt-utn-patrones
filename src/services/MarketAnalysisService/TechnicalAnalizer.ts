import {FacadeRepository} from "../../repository/infra/FacadeRepository";
import {typeTransaction} from "../TradingServices/ITradingService";

export class TechnicalAnalizer {
    facadeRepository: FacadeRepository = FacadeRepository.getInstance();

    //no se usa nunca???
    performTechnicalAnalysis(symbol: string): any {
        const marketData = this.facadeRepository.getMarketDataBySymbol(symbol);


        // Simulación de indicadores técnicos básicos
        const sma20 = this.calculateSimpleMovingAverage(symbol, 20);
        const sma50 = this.calculateSimpleMovingAverage(symbol, 50);
        const rsi = this.calculateRSI(symbol);

        let signal: typeTransaction;

        // Lógica simple de señales
        if (marketData.price > sma20 && sma20 > sma50 && rsi < 70) {
            signal = typeTransaction.buy
        } else if (marketData.price < sma20 && sma20 < sma50 && rsi > 30) {
            signal = typeTransaction.sell
        }else{
            signal = typeTransaction.hold
        }

        return {
            symbol: symbol,
            currentPrice: marketData.price,
            sma20: sma20,
            sma50: sma50,
            rsi: rsi,
            signal: signal,
            timestamp: new Date(),
        };
    }

    // Calcular SMA - Simulación básica
    private calculateSimpleMovingAverage(
        symbol: string,
        periods: number
    ): number {
        const marketData = this.facadeRepository.getMarketDataBySymbol(symbol);
        if (!marketData) return 0;

        // Simulación: SMA = precio actual +/- variación aleatoria
        const randomVariation = (Math.random() - 0.5) * 0.1; // +/- 5%
        return marketData.price * (1 + randomVariation);
    }

    // Calcular RSI - Simulación básica
    private calculateRSI(symbol: string): number {
        // Simulación: RSI aleatorio entre 20 y 80
        return 20 + Math.random() * 60;
    }
}