import { Response } from 'express';

export class ResponseService {
    static ok(res: Response, data: any, message: string = 'OK') {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    }

    static created(res: Response, data: any, message: string = 'Created') {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    static badRequest(res: Response, error: any, message: string = 'Bad Request') {
        return res.status(400).json({
            success: false,
            message,
            error
        });
    }

    static notFound(res: Response, message: string = 'Not Found') {
        return res.status(404).json({
            success: false,
            message
        });
    }
    static unauthorized(res: Response, message: string = 'Unauthorized') {
        return res.status(401).json({
            success: false,
        })
    }

    static internalError(res: Response, error: any, message: string = 'Internal Server Error') {
        return res.status(500).json({
            success: false,
            message,
            error: error?.message || error
        });
    }

    static handleError(res: Response, error: any) {
        // Puedes agregar lógica para loguear el error aquí si lo deseas
        return this.internalError(res, error);
    }
}