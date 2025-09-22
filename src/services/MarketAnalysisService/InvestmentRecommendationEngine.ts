/**
 * CAMBIO 6: Implementación del patrón Builder para recomendaciones de inversión
 * Razón: Construcción compleja de recomendaciones de forma flexible
 * Patrón: Builder Pattern + Strategy Pattern
 */

import { storage } from '../../utils/storage';
import { Asset } from '../../models/Asset/Asset';
import { InvestmentRecommendation, RiskLevel } from './types';
import { PortfolioMetricsCalculator } from './PortfolioMetricsCalculator';

interface RecommendationCriteria {
    userRiskTolerance: string;
    assetVolatility: number;
    hasHolding: boolean;
}

export class InvestmentRecommendationEngine {
    constructor(
        private readonly metricsCalculator: PortfolioMetricsCalculator,
        private readonly maxRecommendations: number = 5
    ) {}

    /**
     * Genera recomendaciones personalizadas de inversión
     */
    generateRecommendations(userId: string): InvestmentRecommendation[] {
        const { user, portfolio } = this.getUserPortfolioData(userId);
        const allAssets = storage.getAllAssets();

        const recommendations = allAssets
            .filter(asset => !this.hasHolding(portfolio, asset))
            .map(asset => this.createRecommendation(asset, user.riskTolerance))
            .filter(rec => rec !== null) as InvestmentRecommendation[];

        return this.sortAndLimit(recommendations);
    }

    private getUserPortfolioData(userId: string) {
        const user = storage.getUserById(userId);
        const portfolio = storage.getPortfolioByUserId(userId);

        if (!user || !portfolio) {
            throw new Error(`Usuario o portafolio no encontrado para ID: ${userId}`);
        }

        return { user, portfolio };
    }

    private hasHolding(portfolio: any, asset: Asset): boolean {
        return portfolio.holdings.some((h: any) => h.symbol === asset.symbol);
    }

    private createRecommendation(
        asset: Asset,
        userRiskTolerance: string
    ): InvestmentRecommendation | null {
        const volatility = this.metricsCalculator.getAssetVolatility(asset.symbol);
        const criteria: RecommendationCriteria = {
            userRiskTolerance,
            assetVolatility: volatility,
            hasHolding: false,
        };

        const recommendation = this.buildRecommendationText(criteria);

        if (!recommendation) return null;

        return {
            symbol: asset.symbol,
            name: asset.name,
            currentPrice: asset.currentPrice,
            recommendation: recommendation.text,
            priority: recommendation.priority,
            riskLevel: this.determineRiskLevel(volatility),
        };
    }

    private buildRecommendationText(criteria: RecommendationCriteria) {
        const { userRiskTolerance, assetVolatility } = criteria;
        const LOW_RISK_VOLATILITY_THRESHOLD = 50;
        const HIGH_RISK_VOLATILITY_THRESHOLD = 60;

        if (userRiskTolerance === "low" && assetVolatility < LOW_RISK_VOLATILITY_THRESHOLD) {
            return {
                text: "Activo de bajo riesgo recomendado para tu perfil conservador",
                priority: 1,
            };
        }

        if (userRiskTolerance === "high" && assetVolatility > HIGH_RISK_VOLATILITY_THRESHOLD) {
            return {
                text: "Activo de alto crecimiento potencial para tu perfil agresivo",
                priority: 2,
            };
        }

        if (userRiskTolerance === "medium") {
            return {
                text: "Activo balanceado adecuado para tu perfil moderado",
                priority: 1,
            };
        }

        return null;
    }

    private determineRiskLevel(volatility: number): RiskLevel {
        const threshold = 60;
        return volatility > threshold ? "high" : "medium";
    }

    private sortAndLimit(recommendations: InvestmentRecommendation[]): InvestmentRecommendation[] {
        return recommendations
            .sort((a, b) => b.priority - a.priority)
            .slice(0, this.maxRecommendations);
    }
}
