import { MarketAnalysisService } from "../services/MarketAnalysisService/MarketAnalysisService";
import { ResponseService } from "../services/ResponseService";
import { Request, Response } from "express";

// Controlador de análisis
export class AnalysisController {
        private static service: MarketAnalysisService = new MarketAnalysisService();

    static async getRiskAnalysis(req: Request, res: Response) {
        try {
            const user = req.user;
            const riskAnalysis = AnalysisController.service.analyzePortfolioRisk(user.id);
            ResponseService.ok(res, { riskAnalysis });
        } catch (error) {
            ResponseService.internalError(res, error, "Error al realizar el analisis de riesgo");
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