
export type RiskLevel = "low" | "medium" | "high";
export type SignalType = "buy" | "sell" | "hold";

export interface RiskInput {
    diversificationScore: number;
    volatilityScore: number;
    riskLevel: RiskLevel;
}

export interface TechnicalIndicators {
    sma20: number;
    sma50: number;
    rsi: number;
}

export interface TechnicalAnalysisResult {
    symbol: string;
    currentPrice: number;
    indicators: TechnicalIndicators;
    signal: SignalType;
    timestamp: Date;
}

export interface InvestmentRecommendation {
    symbol: string;
    name: string;
    currentPrice: number;
    recommendation: string;
    priority: number;
    riskLevel: RiskLevel;
}

export interface VolatilityMap {
    [key: string]: number;
}
