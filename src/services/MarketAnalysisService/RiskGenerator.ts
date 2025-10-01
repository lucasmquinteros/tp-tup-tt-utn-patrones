import { Asset } from "../../models/Asset/Asset";
import { PortfolioHolding } from "../../models/Portfolio/PortfolioHolding";
import { FacadeRepository } from "../../repository/infra/FacadeRepository";
import { AssetRepository } from "../../repository/infra/AssetRepository";

export enum riskLevel {
  low = "low",
  medium = "medium",
  high = "high",
}

// Interfaz Strategy
export interface RiskStrategy {
  generateRiskRecommendations(
    diversificationScore: number,
    volatilityScore: number,
    riskLevel: string
  ): string[];
}

// Estrategia Concreta: Bajo Riesgo
export class LowRiskStrategy implements RiskStrategy {
  generateRiskRecommendations(
    diversificationScore: number,
    volatilityScore: number
  ): string[] {
    const recommendations: string[] = [];

    recommendations.push(
      "Activo de bajo riesgo recomendado para tu perfil conservador"
    );

    if (volatilityScore > 50) {
      recommendations.push(
        "Para tu perfil conservador, evita activos con volatilidad superior al 50%"
      );
    }

    if (diversificationScore < 60) {
      recommendations.push(
        "Considera diversificar en bonos y fondos de renta fija para mayor estabilidad"
      );
    }

    if (diversificationScore > 70 && volatilityScore < 30) {
      recommendations.push(
        "Excelente estrategia conservadora, mantén tu portafolio estable"
      );
    }

    return recommendations;
  }
}

// Estrategia Concreta: Riesgo Medio
export class MediumRiskStrategy implements RiskStrategy {
  generateRiskRecommendations(
    diversificationScore: number,
    volatilityScore: number
  ): string[] {
    const recommendations: string[] = [];

    recommendations.push(
      "Tu perfil es moderado, considera diversificar tu portafolio invirtiendo en diferentes sectores"
    );

    if (diversificationScore < 50) {
      recommendations.push(
        "Aumenta la diversificación para balancear riesgo y rentabilidad"
      );
    }

    if (volatilityScore > 60 && volatilityScore <= 80) {
      recommendations.push(
        "Volatilidad moderada-alta detectada, considera rebalancear con activos más estables"
      );
    }

    if (
      diversificationScore > 70 &&
      volatilityScore >= 40 &&
      volatilityScore <= 60
    ) {
      recommendations.push(
        "Balance adecuado entre riesgo y diversificación para tu perfil moderado"
      );
    }

    return recommendations;
  }
}

// Estrategia Concreta: Alto Riesgo
export class HighRiskStrategy implements RiskStrategy {
  generateRiskRecommendations(
    diversificationScore: number,
    volatilityScore: number,
    riskLevel: string
  ): string[] {
    const recommendations: string[] = [];

    recommendations.push(
      "Activo de alto crecimiento potencial para tu perfil agresivo"
    );

    if (volatilityScore > 80) {
      recommendations.push(
        "Alta volatilidad detectada, excelente para maximizar ganancias potenciales"
      );
    }

    if (diversificationScore < 40) {
      recommendations.push(
        "Aunque tu perfil es agresivo, considera diversificar para reducir riesgo extremo"
      );
    }

    if (riskLevel === "high") {
      recommendations.push(
        "Nivel de riesgo alto detectado, asegúrate de estar preparado para posibles pérdidas"
      );
    }

    if (volatilityScore > 70 && diversificationScore > 60) {
      recommendations.push(
        "Estrategia agresiva bien diversificada, continúa monitoreando activamente"
      );
    }

    return recommendations;
  }
}

// Estrategia Concreta: Diversificación
export class DiversificationStrategy implements RiskStrategy {
  generateRiskRecommendations(
    diversificationScore: number,
    volatilityScore: number,
    riskLevel: string
  ): string[] {
    const recommendations: string[] = [];

    if (diversificationScore < 40) {
      recommendations.push(
        "Considera diversificar tu portafolio invirtiendo en diferentes sectores"
      );
      recommendations.push(
        "Baja diversificación detectada, añade activos de diferentes industrias"
      );
    }

    if (volatilityScore > 70) {
      recommendations.push(
        "Tu portafolio tiene alta volatilidad, considera añadir activos más estables"
      );
    }

    if (diversificationScore > 80 && volatilityScore < 30) {
      recommendations.push(
        "Excelente diversificación y bajo riesgo, mantén esta estrategia"
      );
    }

    if (diversificationScore >= 40 && diversificationScore <= 60) {
      recommendations.push(
        "Diversificación moderada, considera aumentarla para mejor gestión del riesgo"
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

// Clase Contexto: RiskGenerator
export class RiskGenerator {
  private facadeRepository: FacadeRepository = FacadeRepository.getInstance();
  private strategy: RiskStrategy;

  constructor(strategy?: RiskStrategy) {
    // Strategy por defecto: Diversificación
    this.strategy = strategy || new DiversificationStrategy();
  }

  // Método para cambiar la estrategia dinámicamente
  setStrategy(strategy: RiskStrategy): void {
    this.strategy = strategy;
  }

  // Método para ejecutar la estrategia actual
  executeStrategy(
    diversificationScore: number,
    volatilityScore: number,
    riskLevel: string
  ): string[] {
    return this.strategy.generateRiskRecommendations(
      diversificationScore,
      volatilityScore,
      riskLevel
    );
  }
  static getStrategyClass(risk: riskLevel): RiskStrategy {
    switch (risk) {
      case riskLevel.low:
        return new LowRiskStrategy();
      case riskLevel.medium:
        return new MediumRiskStrategy();
      case riskLevel.high:
        return new HighRiskStrategy();
      default:
        return new DiversificationStrategy();
    }
  }

  // Método para obtener la estrategia según el nivel de riesgo
  private getStrategyByRiskLevel(risk: riskLevel): RiskStrategy {
    switch (risk) {
      case riskLevel.low:
        return new LowRiskStrategy();
      case riskLevel.medium:
        return new MediumRiskStrategy();
      case riskLevel.high:
        return new HighRiskStrategy();
      default:
        return new DiversificationStrategy();
    }
  }

  // Generar recomendaciones usando la estrategia apropiada
  generateRiskRecommendations(
    diversificationScore: number,
    volatilityScore: number,
    riskLevel: riskLevel
  ): string[] {
    // Establecer la estrategia según el nivel de riesgo
    this.setStrategy(this.getStrategyByRiskLevel(riskLevel));

    // Ejecutar la estrategia
    return this.executeStrategy(
      diversificationScore,
      volatilityScore,
      riskLevel
    );
  }

  // Generar recomendaciones de inversión - Lógica básica
  generateInvestmentRecommendations(userId: string): any[] {
    const user = this.facadeRepository.getUserById(userId);
    const portfolio = this.facadeRepository.getPortfolioById(userId);

    const recommendations: any[] = [];
    const allAssets = AssetRepository.getInstance().getAllAssets();

    // Establecer estrategia según el perfil del usuario
    this.setStrategy(this.getStrategyByRiskLevel(user.riskTolerance));

    allAssets.forEach((asset: Asset) => {
      const hasHolding: boolean = portfolio.holdings.some(
        (h: PortfolioHolding) => h.symbol === asset.symbol
      );

      if (!hasHolding) {
        const assetVolatility = this.getAssetVolatility(asset.symbol);

        const riskRecommendations = this.executeStrategy(
          50, // Score de diversificación por defecto
          assetVolatility,
          user.riskTolerance
        );

        recommendations.push({
          symbol: asset.symbol,
          name: asset.name,
          currentPrice: asset.currentPrice,
          recommendation: riskRecommendations[0] || "Activo recomendado",
          priority: user.riskTolerance === riskLevel.high ? 2 : 1,
          riskLevel: assetVolatility > 60 ? riskLevel.high : riskLevel.medium,
        });
      }
    });

    // Ordenar por prioridad
    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }

  private getAssetVolatility(symbol: string): number {
    // Implementación básica - debe ser reemplazada con lógica real
    return Math.random() * 100;
  }
}
