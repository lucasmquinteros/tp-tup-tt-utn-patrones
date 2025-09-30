import {Asset} from "../../models/Asset/Asset";
import {PortfolioHolding} from "../../models/Portfolio/PortfolioHolding";
import {FacadeRepository} from "../../repository/infra/FacadeRepository";

export enum riskLevel {
    low = "low",
    medium = "medium",
    high = "high",
}
export class RiskGenerator {
    private facadeRepository: FacadeRepository = FacadeRepository.getInstance();
    generateRiskLevel(userId: string): riskLevel {
        return this.facadeRepository.getUserById(userId).riskTolerance;
    }

    private generateMediumRiskToleranceRecomendation(): {}{
        return {
             recommendation: "Tu perfil es moderado, considera diversificar tu portafolio invirtiendo en diferentes sectores",
             priority: 1,
         };
    }
    private generateHighRiskToleranceRecomendation(): {}{
        return {
            recommendation: "Activo de alto crecimiento potencial para tu perfil agresivo",
            priority: 2,
        }
    }
    private generateLowRiskToleranceRecomendation(): {}{
        return {
            recommendation: "Activo de bajo riesgo recomendado para tu perfil conservador",
            priority: 1,
        }
    }


    // Generar recomendaciones de inversión - Lógica básica
    generateInvestmentRecommendations(userId: string): any[] {
        const user = storage.getUserById(userId);
        const portfolio = storage.getPortfolioByUserId(userId);

        if (!user || !portfolio) {
            throw new Error("Usuario o portafolio no encontrado");
        }

        const recommendations: any[] = [];

        // Recomendaciones basadas en tolerancia al riesgo
        const allAssets = storage.getAllAssets();

        allAssets.forEach((asset: Asset) => {
            const hasHolding: boolean = portfolio.holdings.some(
                (h:PortfolioHolding) => h.symbol === asset.symbol
            );

            if (!hasHolding) {
                let recommendation = "";
                let priority = 0;

                if (
                    user.riskTolerance === "low" &&
                    this.getAssetVolatility(asset.symbol) < 50
                ) {
                    recommendation =
                        "Activo de bajo riesgo recomendado para tu perfil conservador";
                    priority = 1;
                } else if (
                    user.riskTolerance === "high" &&
                    this.getAssetVolatility(asset.symbol) > 60
                ) {
                    recommendation =
                        "Activo de alto crecimiento potencial para tu perfil agresivo";
                    priority = 2;
                } else if (user.riskTolerance === "medium") {
                    recommendation = "Activo balanceado adecuado para tu perfil moderado";
                    priority = 1;
                }

                if (recommendation) {
                    recommendations.push({
                        symbol: asset.symbol,
                        name: asset.name,
                        currentPrice: asset.currentPrice,
                        recommendation: recommendation,
                        priority: priority,
                        riskLevel:
                            this.getAssetVolatility(asset.symbol) > 60 ? "high" : "medium",
                    });
                }
            }
        });

        // Ordenar por prioridad
        return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
    }
    private generateRiskRecommendations(
        diversificationScore: number,
        volatilityScore: number,
        riskLevel: string
    ): string[] {
        const recommendations: string[] = [];

        if (diversificationScore < 40) {
            recommendations.push(
                "Considera diversificar tu portafolio invirtiendo en diferentes sectores"
            );
        }

        if (volatilityScore > 70) {
            recommendations.push(
                "Tu portafolio tiene alta volatilidad, considera añadir activos más estables"
            );
        }

        if (riskLevel === "high") {
            recommendations.push(
                "Nivel de riesgo alto detectado, revisa tu estrategia de inversión"
            );
        }

        if (diversificationScore > 80 && volatilityScore < 30) {
            recommendations.push(
                "Excelente diversificación y bajo riesgo, mantén esta estrategia"
            );
        }

        // Recomendaciones genéricas si no hay específicas
        if (recommendations.length === 0) {
            recommendations.push(
                "Tu portafolio se ve balanceado, continúa monitoreando regularmente"
            );
        }

        return recommendations;
    }
}