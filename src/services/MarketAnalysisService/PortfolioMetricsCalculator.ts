import { Portfolio } from '../../models/Portfolio/Portfolio';
import { FacadeRepository } from '../../repository/infra/FacadeRepository';

const VOLATILITY_BY_SECTOR: Record<string, number> = {};
const DEFAULT_VOLATILITY = 50;
const MAX_SECTORS = 5;
const MAX_CONCENTRATION = 0.3; // 30%
const CONCENTRATION_PENALTY_MULTIPLIER = 100;

export class PortfolioMetricsCalculator {
    constructor(private readonly facade: FacadeRepository) {}

    /**
     * Calcula el score de diversificación del portafolio
     * @returns Score de 0 a 100
     */
    calculateDiversificationScore(portfolio: Portfolio): number {
        if (portfolio.holdings.length === 0) return 0;

        const sectorScore = this.calculateSectorDiversityScore(portfolio);
        const distributionScore = this.calculateDistributionScore(portfolio);

        return Math.min(sectorScore + distributionScore, 100);
    }

    /**
     * Calcula el score de volatilidad ponderada del portafolio
     * @returns Score de 0 a 100
     */
    calculateVolatilityScore(portfolio: Portfolio): number {
        if (portfolio.holdings.length === 0) return 0;

        const totalValue = portfolio.totalValue;
        const weightedVolatility = portfolio.holdings.reduce((total, holding) => {
            const weight = holding.currentValue / totalValue;
            const assetVolatility = this.getAssetVolatility(holding.symbol);
            return total + (weight * assetVolatility);
        }, 0);

        return Math.min(weightedVolatility, 100);
    }

    /**
     * Obtiene la volatilidad estimada de un activo basada en su sector
     */
    getAssetVolatility(symbol: string): number {
        try {
            const asset = this.facade.getAssetBySymbol(symbol);
            return VOLATILITY_BY_SECTOR[asset.sector] || DEFAULT_VOLATILITY;
        } catch {
            return DEFAULT_VOLATILITY;
        }
    }

    private calculateSectorDiversityScore(portfolio: Portfolio): number {
        const sectors = new Set<string>();

        portfolio.holdings.forEach(holding => {
            const asset = this.facade.getAssetBySymbol(holding.symbol);
            sectors.add(asset.sector);
        });

        const sectorCount = sectors.size;
        const maxSectors = MAX_SECTORS;

        return Math.min(sectorCount / maxSectors, 1) * 50;
    }

    private calculateDistributionScore(portfolio: Portfolio): number {
        const totalValue = portfolio.totalValue;
        const maxConcentration = MAX_CONCENTRATION;
        const penaltyMultiplier = CONCENTRATION_PENALTY_MULTIPLIER;

        const concentrationPenalty = portfolio.holdings.reduce((penalty, holding) => {
            const weight = holding.currentValue / totalValue;
            if (weight > maxConcentration) {
                return penalty + ((weight - maxConcentration) * penaltyMultiplier);
            }
            return penalty;
        }, 0);

        return Math.max(50 - concentrationPenalty, 0);
    }
}