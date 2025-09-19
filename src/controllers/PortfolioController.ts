export class PortfolioController {
    static async getPortfolio(req: Request, res: Response) {
        try {
            const user = req.user;
            const portfolio = storage.getPortfolioByUserId(user.id);

            if (!portfolio) {
                return res.status(404).json({
                    error: "Portafolio no encontrado",
                    message: "No se encontró el portafolio del usuario",
                });
            }

            res.json({
                portfolio: {
                    holdings: portfolio.holdings,
                    totalValue: portfolio.totalValue,
                    totalInvested: portfolio.totalInvested,
                    totalReturn: portfolio.totalReturn,
                    percentageReturn: portfolio.percentageReturn,
                    lastUpdated: portfolio.lastUpdated,
                },
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener portafolio",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    static async getPerformance(req: Request, res: Response) {
        try {
            const user = req.user;
            const portfolio = storage.getPortfolioByUserId(user.id);

            if (!portfolio) {
                return res.status(404).json({
                    error: "Portafolio no encontrado",
                    message: "No se encontró el portafolio del usuario",
                });
            }

            // Análisis básico de rendimiento
            const performance = {
                totalValue: portfolio.totalValue,
                totalInvested: portfolio.totalInvested,
                totalReturn: portfolio.totalReturn,
                percentageReturn: portfolio.percentageReturn,
                bestPerformer: null as any,
                worstPerformer: null as any,
                diversification: {
                    holdingsCount: portfolio.holdings.length,
                    sectors: [
                        ...new Set(
                            portfolio.holdings.map((h) => {
                                const asset = storage.getAssetBySymbol(h.symbol);
                                return asset ? asset.sector : "Unknown";
                            })
                        ),
                    ],
                },
            };

            // Encontrar activos con mayor y menor rendimiento
            if (portfolio.holdings.length > 0) {
                const sortedByReturn = [...portfolio.holdings].sort(
                    (a, b) => b.percentageReturn - a.percentageReturn
                );
                performance.bestPerformer = sortedByReturn[0];
                performance.worstPerformer = sortedByReturn[sortedByReturn.length - 1];
            }

            res.json({ performance });
        } catch (error) {
            res.status(500).json({
                error: "Error al analizar rendimiento",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}
