
import {RiskInput, RiskLevel} from './types';

export interface IRiskRecommendationStrategy {
    generate(risk: RiskInput): string[];
}

/**
 * Estrategia por defecto para generar recomendaciones de riesgo
 */
export class DefaultRiskRecommendationStrategy implements IRiskRecommendationStrategy {

    generate({ diversificationScore, volatilityScore, riskLevel }: RiskInput): string[] {
        const recommendations: string[] = [];

        this.checkDiversification(diversificationScore, recommendations);
        this.checkVolatility(volatilityScore, recommendations);
        this.checkRiskLevel(riskLevel, recommendations);
        this.checkOptimalConditions(diversificationScore, volatilityScore, recommendations);

        return recommendations.length > 0
            ? recommendations
            : ["Tu portafolio se ve balanceado, continúa monitoreando regularmente"];
    }

    private checkDiversification(score: number, recommendations: string[]): void {
        if (score < 40) {
            recommendations.push(
                "Considera diversificar tu portafolio invirtiendo en diferentes sectores"
            );
        }
    }

    private checkVolatility(score: number, recommendations: string[]): void {
        if (score > 60) {
            recommendations.push(
                "Tu portafolio tiene alta volatilidad, considera añadir activos más estables"
            );
        }
    }

    private checkRiskLevel(level: RiskLevel, recommendations: string[]): void {
        if (level === "high") {
            recommendations.push(
                "Nivel de riesgo alto detectado, revisa tu estrategia de inversión"
            );
        }
    }

    private checkOptimalConditions(
        diversification: number,
        volatility: number,
        recommendations: string[]
    ): void {
        if (diversification > 80 && volatility < 30) {
            recommendations.push(
                "Excelente diversificación y bajo riesgo, mantén esta estrategia"
            );
        }
    }
}

/**
 * Estrategia conservadora para inversores con aversión al riesgo
 */
export class ConservativeRiskRecommendationStrategy implements IRiskRecommendationStrategy {
    generate({ diversificationScore, volatilityScore, riskLevel }: RiskInput): string[] {
        const recommendations: string[] = [];

        if (volatilityScore > 40) {
            recommendations.push("Considera reducir exposición a activos volátiles");
        }

        if (diversificationScore < 60) {
            recommendations.push("Aumenta la diversificación para reducir el riesgo sistemático");
        }

        return recommendations;
    }
}