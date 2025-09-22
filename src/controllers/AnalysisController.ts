import { IMarketAnalysisService, createDefaultMarketAnalysisService } from "../services/MarketAnalysisService/MarketAnalysisService";
import { ResponseService } from "../services/ResponseService";
import { Request, Response } from "express";

// Controlador de análisis
export class AnalysisController {
        private static service: IMarketAnalysisService = createDefaultMarketAnalysisService();

    static async getRiskAnalysis(req: Request, res: Response) {
        try {
            const user = req.user;
            const riskAnalysis = AnalysisController.service.analyzePortfolioRisk(user.id);
            ResponseService.ok(res, { riskAnalysis });
        } catch (error) {
            ResponseService.internalError(res, {
                error: "Error en análisis de riesgo",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    static async getRecommendations(req: Request, res: Response) {
        try {
            const user = req.user;
            const recommendations = AnalysisController.service.generateInvestmentRecommendations(user.id);
            ResponseService.ok(res, { recommendations });
        } catch (error) {
            ResponseService.internalError(res, error, "Error al generar recomendaciones");
        }
    }
}