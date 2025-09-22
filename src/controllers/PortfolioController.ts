import {storage} from "../utils/storage";
import {User} from "../models/User/User";
import {ResponseService} from "../services/ResponseService";
import {Request, Response} from "express";
import {PortfolioRepository} from "../repository/infra/PortfolioRepository";
import {AssetRepository} from "../repository/infra/AssetRepository";


export class PortfolioController {

    private static PortfolioRepository: PortfolioRepository;
    private static AssetRepository: AssetRepository;
    constructor(PortfolioRepository: PortfolioRepository, AssetRepository: AssetRepository) {
        PortfolioController.PortfolioRepository = PortfolioRepository;
        PortfolioController.AssetRepository = AssetRepository;
    }

    static async getPortfolio(req: Request, res: Response) {
        try {
            const user: User = req.user;
            const portfolio = PortfolioController.PortfolioRepository.findByUserId(user.id)

            if (!portfolio) {
                ResponseService.notFound(res, "Portafolio no encontrado");
            }


        } catch (error) {
            ResponseService.internalError(res, error, "Error al obtener portafolio");
        }
    }

    static async getPerformance(req: Request, res: Response) {
        try {
            const user: User = req.user;
            const portfolio = this.PortfolioRepository.findByUserIdOrFail(user.id)



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
                                const asset = PortfolioController.AssetRepository.findBySymbol(h.symbol);
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

            ResponseService.ok(res, performance, "Rendimiento obtenido exitosamente");
        } catch (error) {
            ResponseService.internalError(res, error, "Error al obtener rendimiento");
        }
    }
}
