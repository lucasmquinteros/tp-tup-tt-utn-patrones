import {Request, Response} from "express";

export class AuthController {
    static async validateApiKey(req: Request, res: Response) {
        try {
            // Si llegamos aquí, el middleware ya validó la API key
            const user = req.user;

            res.json({
                valid: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                message: "API key válida",
            });
        } catch (error) {
            res.status(500).json({
                error: "Error interno del servidor",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}
