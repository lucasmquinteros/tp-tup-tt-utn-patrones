import {TradingService} from "../services/TradingServices/TradingService";
import {Request, Response} from "express";
import {Validator} from "../utils/validator";
import {ResponseService} from "../services/ResponseService";

export class TradingController {
    private static _tradingService: TradingService;


    constructor(TradingService: TradingService) {
        TradingController._tradingService = TradingService;
    }

    static async buyAsset(req: Request, res: Response) {
        try {
            const { symbol, quantity } = req.body;
            const user = req.user;
            Validator.validateQuantity(quantity);
            Validator.validateSymbol(symbol);

            // Ejecutar orden de compra
            const transaction = await TradingController._tradingService.executeBuyOrder(
                user.id,
                symbol.toUpperCase(),
                quantity
            );

            ResponseService.ok(res, transaction, "Orden de compra ejecutada exitosamente")
        } catch (error) {
            ResponseService.internalError(res, error, "Error en orden de compra");
        }
    }

    static async sellAsset(req: Request, res: Response) {
        try {
            const { symbol, quantity } = req.body;
            const user = req.user;
            Validator.validateQuantity(quantity);
            Validator.validateSymbol(symbol);
            //falta validar el monto de la venta con el asset

            // Ejecutar orden de venta
            const transaction = await TradingController._tradingService.executeSellOrder(
                user.id,
                symbol.toUpperCase(),
                quantity
            );

            ResponseService.ok(res, transaction, "Orden de venta ejecutada exitosamente")
        } catch (error) {
            ResponseService.internalError(res, error, "Error en orden de venta");
        }
    }

    static async getTransactionHistory(req: Request, res: Response) {
        try {
            const user = req.user;
            const transactions = TradingController._tradingService.getTransactionHistory(user.id);

            ResponseService.ok(res, transactions, "Historial de transacciones obtenido exitosamente");
        } catch (error) {
            ResponseService.internalError(res, error, "Error al obtener historial de transacciones");
        }
    }
}
