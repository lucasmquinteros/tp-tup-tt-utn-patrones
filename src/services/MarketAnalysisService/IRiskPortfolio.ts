import { Portfolio } from "../../models/Portfolio/Portfolio";
import { RiskAnalysis } from "../../models/RiskAnalysis/RiskAnalisis";
export enum riskLevel {
    "low" = "low",
    "medium" = "medium",
    "high" = "high"
}
export interface IRiskPortfolio {
    _generateRiskRecommendations(risk: RiskInput): string[];
}
interface RiskInput {
  diversificationScore: number;
  volatilityScore: number;
  riskLevel: "low" | "medium" | "high";
}

export class RiskStrategy implements IRiskPortfolio {
    private _risk: any;
    constructor(risk: any) {
        this._risk = risk;
    }

    _generateRiskRecommendations(risk: RiskInput): string[] {
  const { diversificationScore, volatilityScore, riskLevel } = risk;
  const recommendations: string[] = [];

  if (diversificationScore < 40) {
    recommendations.push("Considera diversificar tu portafolio invirtiendo en diferentes sectores");
  }

  if (volatilityScore > 70) {
    recommendations.push("Tu portafolio tiene alta volatilidad, considera añadir activos más estables");
  }

  if (riskLevel === "high") {
    recommendations.push("Nivel de riesgo alto detectado, revisa tu estrategia de inversión");
  }

  if (diversificationScore > 80 && volatilityScore < 30) {
    recommendations.push("Excelente diversificación y bajo riesgo, mantén esta estrategia");
  }

  if (recommendations.length === 0) {
    recommendations.push("Tu portafolio se ve balanceado, continúa monitoreando regularmente");
  }

  return recommendations;
}

}