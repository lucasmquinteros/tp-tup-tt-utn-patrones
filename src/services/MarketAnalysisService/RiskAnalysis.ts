import {Portfolio} from "../../models/Portfolio/Portfolio";
import {PortfolioHolding} from "../../models/Portfolio/PortfolioHolding";
import {FacadeRepository} from "../../repository/infra/FacadeRepository";

//Estos son constantes asi que podemos guardarlos en un archivo separado o fuera de clases estilo enums.
export const volatilityBySector: { [key: string]: number } = {
    Technology: 65,
    Healthcare: 45,
    Financial: 55,
    Automotive: 70,
    "E-commerce": 60,
};

export class RiskAnalysisGenerator {
    private facadeRepository: FacadeRepository = FacadeRepository.getInstance();
    // Calcular score de diversificación - Algoritmo simplificado
    calculateDiversificationScore(portfolio: Portfolio): number {
        if (portfolio.holdings.length === 0) return 0;

        // Contar sectores únicos
        const sectors = new Set<string>();
        portfolio.holdings.forEach((holding) => {
            const asset = this.facadeRepository.getAssetBySymbol(holding.symbol);
            sectors.add(asset.sector);
        });

        // Score basado en número de sectores y distribución
        const sectorCount = sectors.size;
        const maxSectors = 5; // Número máximo de sectores considerados
        const sectorScore = Math.min(sectorCount / maxSectors, 1) * 50;

        // Score basado en distribución de pesos
        const totalValue = portfolio.totalValue;
        let concentrationPenalty = 0;

        portfolio.holdings.forEach((holding: PortfolioHolding) => {
            const weight = holding.currentValue / totalValue;
            if (weight > 0.3) {
                // Penalizar concentraciones > 30%
                concentrationPenalty += (weight - 0.3) * 100;
            }
        });

        const distributionScore = Math.max(50 - concentrationPenalty, 0);

        return Math.min(sectorScore + distributionScore, 100);
    }

    // Calcular score de volatilidad - Algoritmo básico
    calculateVolatilityScore(portfolio: Portfolio): number {
        if (portfolio.holdings.length === 0) return 0;

        let weightedVolatility = 0;
        const totalValue = portfolio.totalValue;

        portfolio.holdings.forEach((holding) => {
            const weight = holding.currentValue / totalValue;
            const asset = this.facadeRepository.getAssetBySymbol(holding.symbol);
            const assetVolatility = asset.sector in volatilityBySector ? volatilityBySector[asset.sector] : 50;
            weightedVolatility += weight * assetVolatility;
        });

        return Math.min(weightedVolatility, 100);
    }
}
