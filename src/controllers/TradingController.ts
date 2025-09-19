import {ITradingService} from "../services/TradingService";
import {Request, Response} from "express";
import {Validator} from "../utils/validator";

export class TradingController {
    private static _tradingService: ITradingService;


    constructor(ITradingService: ITradingService) {
        TradingController._tradingService = ITradingService;
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

            res.status(201).json({
                message: "Orden de compra ejecutada exitosamente",
                transaction: {
                    id: transaction.id,
                    type: transaction.type,
                    symbol: transaction.symbol,
                    quantity: transaction.quantity,
                    price: transaction.price,
                    fees: transaction.fees,
                    timestamp: transaction.timestamp,
                    status: transaction.status,
                },
            });
        } catch (error) {
            res.status(400).json({
                error: "Error en orden de compra",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
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

            res.status(201).json({
                message: "Orden de venta ejecutada exitosamente",
                transaction: {
                    id: transaction.id,
                    type: transaction.type,
                    symbol: transaction.symbol,
                    quantity: transaction.quantity,
                    price: transaction.price,
                    fees: transaction.fees,
                    timestamp: transaction.timestamp,
                    status: transaction.status,
                },
            });
        } catch (error) {
            res.status(400).json({
                error: "Error en orden de venta",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    static async getTransactionHistory(req: Request, res: Response) {
        try {
            const user = req.user;
            const transactions = TradingController._tradingService.getTransactionHistory(user.id);

            res.json({
                transactions: transactions.map((transaction) => ({
                    id: transaction.id,
                    type: transaction.type,
                    symbol: transaction.symbol,
                    quantity: transaction.quantity,
                    price: transaction.price,
                    fees: transaction.fees,
                    timestamp: transaction.timestamp,
                    status: transaction.status,
                })),
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener historial",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}
