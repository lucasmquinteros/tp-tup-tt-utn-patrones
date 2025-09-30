import {User} from "../models/User/User";
import {ResponseService} from "../services/ResponseService";
import {Request, Response} from "express";
import {FacadeRepository} from "../repository/infra/FacadeRepository";


export class PortfolioController {

    private static facade: FacadeRepository = FacadeRepository.getInstance();

    static async getPortfolio(req: Request, res: Response) {
        try {
            const user: User = req.user;
            const portfolio = PortfolioController.facade.getPortfolioById(user.id)

            if (!portfolio) {
                ResponseService.notFound(res, "Portafolio no encontrado");
                return;
            }

            ResponseService.ok(res, portfolio, "Portafolio obtenido exitosamente");
        } catch (error) {
            ResponseService.internalError(res, error, "Error al obtener portafolio");
        }
    }

    static async getPerformance(req: Request, res: Response) {
        try {
            const user: User = req.user;
            const portfolio = PortfolioController.facade.getPortfolioById(user.id)



            // Análisis básico de rendimiento
            const performance = {
                ...portfolio,
                bestPerformer: null as any,
                worstPerformer: null as any,
                diversification: {
                    holdingsCount: portfolio.holdings.length,
                    sectors: [
                        ...new Set(
                            portfolio.holdings.map((h) => {
                                try {
                                    const asset = PortfolioController.facade.getAssetBySymbol(h.symbol);
                                    return asset.sector;
                                } catch {
                                    return "Unknown";
                                }
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

            ResponseService.ok(res, performance, "Rendimiento obtenido exitosamente");
        } catch (error) {
            ResponseService.internalError(res, error, "Error al obtener rendimiento");
        }
    }
}
