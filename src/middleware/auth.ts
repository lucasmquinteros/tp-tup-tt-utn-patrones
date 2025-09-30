// Middleware de autenticación
import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";
import {ResponseService} from "../services/ResponseService";
import {UserRepository} from "../repository/infra/UserRepository";
import {Validator} from "../utils/validator";

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware de autenticación por API key
export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
      const apiKey = req.headers["x-api-key"] as string;

      if (!apiKey) {
          ResponseService.unauthorized(res, "API key requerida");
      }

      // Validar API key hardcodeada
      const username = config.apiKeys[apiKey as keyof typeof config.apiKeys];
      if (!username) {
          ResponseService.unauthorized(res)
      }

      // Buscar usuario en storage
      const user = UserRepository.getInstance().findByApiKey(apiKey);
      if (!user) {
          ResponseService.unauthorized(res, "No se encontro un usuario con esa API key")
      }

      // Agregar usuario al request
      req.user = user;
      next();
  }catch (error) {
      ResponseService.internalError(res, error, "Error al autenticar API key");
  }

};

// Middleware de logging de requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers["user-agent"] || "Unknown";

  console.log(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`);

  // Log adicional si hay usuario autenticado
  if (req.user) {
    console.log(`[${timestamp}] Authenticated user: ${req.user.username}`);
  }

  next();
};

// Middleware de validación de datos de trading
export const validateTradeData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    //implementar tipos de errores
  const { symbol, quantity, price } = req.body;
  try{
      // Validaciones básicas
      Validator.validateSymbol(symbol)

      Validator.validateQuantity(quantity)

      Validator.validatePrice(price)

      // Validar límites de configuración
      if (quantity > config.limits.maxOrderSize) {
          ResponseService.badRequest(res, { error: "Cantidad Mayor al limite de ordenes" }, "Cantidad mayor al limite de ordenes")
      }

      if (quantity < config.limits.minOrderSize) {
          ResponseService.badRequest(res, { error: "Cantidad Menor al limite de ordenes"}, "Cantidad menor al limite de ordenes")
      }
  }catch (error) {
      ResponseService.badRequest(res, error, "Error al validar datos de trading");
  }


  next();
};
