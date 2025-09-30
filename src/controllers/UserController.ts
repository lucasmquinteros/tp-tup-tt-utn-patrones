import {Request, Response} from "express";
import { UpdateProfileSchema } from "../models/User/UserSchema"
import { UserDTO } from "../models/User/UserDTO";
import { User } from "../models/User/User";
import { ResponseService } from "../services/ResponseService";
import {UserRepository} from "../repository/infra/UserRepository";

export class UserController {
    static async getProfile(req: Request, res: Response) {
        try {
            const user: User = req.user;

            ResponseService.ok(res, UserDTO.toPublic(user), "Perfil obtenido exitosamente");
        } catch (error) {
            ResponseService.notFound(res, "Error al obtener perfil");
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

            UserRepository.getInstance().updateUser(user)

            ResponseService.ok(res, UserDTO.toPublic(user), "Perfil actualizado exitosamente");
        } catch (error) {
            ResponseService.internalError(res, error, "Error al actualizar perfil");    
            
        }
    }
}
