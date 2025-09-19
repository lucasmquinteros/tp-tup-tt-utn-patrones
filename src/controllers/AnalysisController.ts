import { MarketAnalysisService } from "../services/MarketAnalysisService/MarketAnalysisService";
import { ResponseService } from "../services/ResponseService";


// Controlador de análisis
export class AnalysisController {
    static async getRiskAnalysis(req: Request, res: Response) {
        try {
            const user = req.user;
            const riskAnalysis = MarketAnalysisService.analyzePortfolioRisk(user.id);

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
            const recommendations = analysisService.generateInvestmentRecommendations(
                user.id
            );

            res.json({ recommendations });
        } catch (error) {
            res.status(500).json({
                error: "Error al generar recomendaciones",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}