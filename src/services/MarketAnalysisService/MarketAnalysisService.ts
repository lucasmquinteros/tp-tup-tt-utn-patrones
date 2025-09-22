import { RiskAnalysis } from '../../models/RiskAnalysis/RiskAnalisis';
import { PortfolioRepository } from '../../repository/infra/PortfolioRepository';
import { AssetRepository } from '../../repository/infra/AssetRepository';
import { IRiskRecommendationStrategy, DefaultRiskRecommendationStrategy } from './RiskRecomendations';
import { PortfolioMetricsCalculator } from './PortfolioMetricsCalculator';
import { TechnicalAnalyzer } from './TechnicalAnalyzer';
import { InvestmentRecommendationEngine } from './InvestmentRecommendationEngine';
import { TechnicalAnalysisResult, InvestmentRecommendation, RiskLevel } from './types';

export interface IMarketAnalysisService {
    analyzePortfolioRisk(userId: string): RiskAnalysis;
    performTechnicalAnalysis(symbol: string): TechnicalAnalysisResult;
    generateInvestmentRecommendations(userId: string): InvestmentRecommendation[];
}

/**
 * Servicio principal de análisis de mercado
 * Actúa como fachada coordinando múltiples componentes especializados
 */
export class MarketAnalysisService implements IMarketAnalysisService {
    constructor(
        private readonly portfolioRepository: PortfolioRepository,
        private readonly assetRepository: AssetRepository,
        private readonly riskRecommendationStrategy: IRiskRecommendationStrategy,
        private readonly metricsCalculator: PortfolioMetricsCalculator,
        private readonly technicalAnalyzer: TechnicalAnalyzer,
        private readonly recommendationEngine: InvestmentRecommendationEngine
    ) {}

    static createDefault(): IMarketAnalysisService {
        const portfolioRepository = new PortfolioRepository();
        const assetRepository = new AssetRepository();
        const metricsCalculator = new PortfolioMetricsCalculator(assetRepository);
        const technicalAnalyzer = new TechnicalAnalyzer();
        const riskStrategy = new DefaultRiskRecommendationStrategy();
        const recommendationEngine = new InvestmentRecommendationEngine(metricsCalculator);

        return new MarketAnalysisService(
            portfolioRepository,
            assetRepository,
            riskStrategy,
            metricsCalculator,
            technicalAnalyzer,
            recommendationEngine
        );
    }

    /**
     * Analiza el riesgo completo del portafolio del usuario
     * @param userId - ID del usuario
     * @returns Análisis de riesgo completo
     */
    analyzePortfolioRisk(userId: string): RiskAnalysis {
        const portfolio = this.portfolioRepository.getOneByIdOrFail(userId);

        const diversificationScore = this.metricsCalculator.calculateDiversificationScore(portfolio);
        const volatilityScore = this.metricsCalculator.calculateVolatilityScore(portfolio);
        const riskLevel = this.determineRiskLevel(diversificationScore, volatilityScore);

        const recommendations = this.riskRecommendationStrategy.generate({
            diversificationScore,
            volatilityScore,
            riskLevel,
        });

        const riskAnalysis = new RiskAnalysis(userId);
        riskAnalysis.updateRisk(riskLevel, diversificationScore, recommendations);

        return riskAnalysis;
    }

    /**
     * Realiza análisis técnico de un símbolo específico
     * @param symbol - Símbolo del activo
     * @returns Resultado del análisis técnico
     */
    performTechnicalAnalysis(symbol: string): TechnicalAnalysisResult {
        return this.technicalAnalyzer.analyze(symbol);
    }

    /**
     * Genera recomendaciones de inversión personalizadas
     * @param userId - ID del usuario
     * @returns Lista de recomendaciones de inversión
     */
    generateInvestmentRecommendations(userId: string): InvestmentRecommendation[] {
        return this.recommendationEngine.generateRecommendations(userId);
    }

    /**
     * Determina el nivel de riesgo basado en métricas del portafolio
     */
    private determineRiskLevel(
        diversificationScore: number,
        volatilityScore: number
    ): RiskLevel {
        // thresholds inlined: LOW_VOLATILITY=30, MEDIUM_VOLATILITY=60, HIGH_DIVERSIFICATION=70, MEDIUM_DIVERSIFICATION=40

        if (volatilityScore < 30 &&
            diversificationScore > 70) {
            return "low";
        }

        if (volatilityScore < 60 &&
            diversificationScore > 40) {
            return "medium";
        }

        return "high";
    }
}


export function createDefaultMarketAnalysisService(): IMarketAnalysisService {
    return MarketAnalysisService.createDefault();
}
