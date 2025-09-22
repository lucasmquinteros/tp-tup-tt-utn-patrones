import { storage } from '../../utils/storage';
import { TechnicalAnalysisResult, TechnicalIndicators, SignalType } from "./types";

export class TechnicalAnalyzer {

    /**
     * Realiza análisis técnico completo de un símbolo
     */
    analyze(symbol: string): TechnicalAnalysisResult {
        const marketData = this.getMarketData(symbol);
        const indicators = this.calculateIndicators(symbol, marketData.price);
        const signal = this.generateSignal(marketData.price, indicators);

        return {
            symbol,
            currentPrice: marketData.price,
            indicators,
            signal,
            timestamp: new Date(),
        };
    }

    private getMarketData(symbol: string) {
        const marketData = storage.getMarketDataBySymbol(symbol);
        if (!marketData) {
            throw new Error(`Datos de mercado no encontrados para ${symbol}`);
        }
        return marketData;
    }

    private calculateIndicators(symbol: string, currentPrice: number): TechnicalIndicators {
        return {
            sma20: this.calculateSMA(currentPrice, 20),
            sma50: this.calculateSMA(currentPrice, 50),
            rsi: this.calculateRSI(),
        };
    }

    private calculateSMA(basePrice: number, periods: number): number {
        // Simulación mejorada con factor de período
        const periodFactor = 1 - (periods / 1000);
        const randomVariation = (Math.random() - 0.5) * 0.1;
        return basePrice * (periodFactor + randomVariation);
    }

    private calculateRSI(): number {
        // Simulación con distribución más realista
        const base = 50;
        const variation = (Math.random() - 0.5) * 60;
        return Math.max(0, Math.min(100, base + variation));
    }

    private generateSignal(
        currentPrice: number,
        { sma20, sma50, rsi }: TechnicalIndicators
    ): SignalType {
        const isBullishTrend = currentPrice > sma20 && sma20 > sma50;
        const isBearishTrend = currentPrice < sma20 && sma20 < sma50;
        const isOverbought = rsi > 70;
        const isOversold = rsi < 30;

        if (isBullishTrend && !isOverbought) {
            return "buy";
        } else if (isBearishTrend && !isOversold) {
            return "sell";
        }

        return "hold";
    }
}