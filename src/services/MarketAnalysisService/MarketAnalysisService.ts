import {RiskAnalysis} from "../../models/RiskAnalysis/RiskAnalisis";
import {RiskAnalysisGenerator} from "./RiskAnalysis";
import {FacadeRepository} from "../../repository/infra/FacadeRepository";
import {RiskGenerator, riskLevel} from "./RiskGenerator";

export class MarketAnalysisService {
    private recommendationGenerator: RiskGenerator = new RiskGenerator()
    private riskAnalysisGenerator: RiskAnalysisGenerator = new RiskAnalysisGenerator();
    // Análisis de riesgo del portafolio
    analyzePortfolioRisk(userId: string): RiskAnalysis {
        const portfolio = FacadeRepository.getInstance().getPortfolioById(userId);

        // Cálculo básico de diversificación
        const diversificationScore = this.riskAnalysisGenerator.calculateDiversificationScore(portfolio);

        // Cálculo básico de volatilidad
        const volatilityScore = this.riskAnalysisGenerator.calculateVolatilityScore(portfolio);

        // Determinar nivel de riesgo general
        let portfolioRisk: riskLevel;
        if (volatilityScore < 30 && diversificationScore > 70) {
            portfolioRisk = riskLevel.low;
        } else if (volatilityScore < 60 && diversificationScore > 40) {
            portfolioRisk = riskLevel.medium;
        } else {
            portfolioRisk = riskLevel.high;
        }

        // Generar recomendaciones básicas
        const recommendations: string[] = this.recommendationGenerator.generateRiskRecommendations(
            diversificationScore,
            volatilityScore,
            portfolioRisk
        );

        const riskAnalysis = new RiskAnalysis(userId);
        riskAnalysis.updateRisk(
            portfolioRisk,
            diversificationScore,
            recommendations
        );

        return riskAnalysis;
    }
}