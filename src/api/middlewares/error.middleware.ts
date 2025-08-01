import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error(err); // o usa logger
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
}
