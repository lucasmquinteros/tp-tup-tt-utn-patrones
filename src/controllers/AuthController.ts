import {Request, Response} from "express";
import { ResponseService } from "../services/ResponseService";

export class AuthController {
    static async validateApiKey(req: Request, res: Response) {
        try {
            // Si llegamos aquí, el middleware ya validó la API key
            const user = req.user;

            ResponseService.ok(res, { user }, "API key válida");
        } catch (error) {
            ResponseService.internalError(res, error, "Error al validar API key");
        }
    }
}
