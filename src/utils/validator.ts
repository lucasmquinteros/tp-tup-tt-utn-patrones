import {storage} from "./storage";

export class Validator {
    static async validateAsset(req: Request, res: Response){
        const user = req.user;
        const { symbol, quantity } = req.body;
        // Validaciones adicionales específicas de compra
        try{
            validateSymbol(symbol);
        }

        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({
                error: "Cantidad inválida",
                message: "La cantidad debe ser un número mayor a 0",
            });
        }

        // Verificar que el activo existe
        const asset = storage.getAssetBySymbol(symbol.toUpperCase());
        if (!asset) {
            return res.status(404).json({
                error: "Activo no encontrado",
                message: `El activo ${symbol} no existe`,
            });
        }
        return {
            user,
            symbol,
            quantity,
        };
            }
    private validateSymbol(symbol: string){
        if (!symbol || typeof symbol !== "string") {
            return res.status(400).json({
                error: "Símbolo requerido",
                message: "El símbolo del activo es requerido",
            });
        }
    }
}
