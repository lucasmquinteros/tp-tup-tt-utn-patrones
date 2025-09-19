import {Request, Response} from "express";
import {storage} from "../utils/storage";
import { UpdateProfileSchema } from "../models/User/UserSchema"
import { UserDTO, User } from "../models/User/UserDTO";

export class UserController {
    static async getProfile(req: Request, res: Response) {
        try {
            const user = req.user;

            res.json({ message: "Perfil obtenido exitosamente", user: UserDTO.toPublic(user) });

            ;
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener perfil",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const user = req.user;

            // Validaciones básicas usando zod
            const result = UpdateProfileSchema.safeParse(req.body);
            if (!result.success) {
                throw new Error("Formato Invalido")
            }
            const { email, riskTolerance } = result.data;

            // Actualizar campos
            if (email) user.email = email;
            if (riskTolerance) user.riskTolerance = riskTolerance;

            storage.updateUser(user);

            res.json({
                message: "Perfil actualizado exitosamente",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    balance: user.balance,
                    riskTolerance: user.riskTolerance,
                },
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al actualizar perfil",
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
}
