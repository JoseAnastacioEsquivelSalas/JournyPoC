import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('[validate] ejecutando validación...');
    const result = schema.safeParse(req.body);
    if (!result.success) {
        console.log('[validate] errores de validación:', result.error.format());
        return res.status(400).json({
            message: 'Validation failed',
            errors: result.error.errors,
        });
    }
    next();
};
