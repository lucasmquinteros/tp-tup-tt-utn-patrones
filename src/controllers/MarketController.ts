import {Request, Response} from "express";
import {storage} from "../utils/storage";
import {ResponseService} from "../services/ResponseService";

export class MarketController {
    static async getPrices(req: Request, res: Response) {
        try {
            const marketData = storage.getAllMarketData();

            ResponseService.ok(res, marketData, "Precios obtenidos exitosamente");
        } catch (error) {
            ResponseService.internalError(res, error, "Error al obtener precios");
        }
    }

    static async getPriceBySymbol(req: Request, res: Response) {
        try {
            const { symbol } = req.params;
            const marketData = storage.getMarketDataBySymbol(symbol.toUpperCase());

            if (!marketData) {
                ResponseService.notFound(res, "Activo no encontrado");
            }

            ResponseService.ok(res, marketData, "Precio obtenido exitosamente");
        } catch (error) {
            ResponseService.internalError(res, error, "Error al obtener precio");
        }
    }
}
