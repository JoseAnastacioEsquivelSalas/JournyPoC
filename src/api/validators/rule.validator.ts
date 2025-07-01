// src/api/validators/rule.validator.ts
import { z } from 'zod';

/**
 * Operadores válidos de json-rules-engine
 */
const Operators = z.enum([
    'equal',
    'notEqual',
    'greaterThan',
    'greaterThanInclusive',
    'lessThan',
    'lessThanInclusive',
    'in',
    'notIn',
    'contains',
    'startsWith',
    'endsWith'
]);

/**
 * Una condición individual o anidada
 */
const Condition: z.ZodType<any> = z.lazy(() =>
    z.object({
        fact: z.string(),
        operator: Operators,
        value: z.any(),
        path: z.string().optional(),
        params: z.any().optional()
    })
);

/**
 * Condiciones tipo `all` o `any`, recursivas
 */
const Conditions = z.lazy(() =>
    z.object({
        all: z.array(Condition).optional(),
        any: z.array(Condition).optional()
    }).refine(data => data.all || data.any, {
        message: "Debe contener 'all' o 'any'"
    })
);

/**
 * Evento disparado por la regla
 */
const Event = z.object({
    type: z.string(),
    params: z.record(z.string()) // asumimos que todo es string, incluyendo plantillas
});

/**
 * Regla completa
 */
export const AddRuleSchema = z.object({
    jsonRule: z.object({
        name: z.string(),
        conditions: Conditions,
        event: Event,
        priority: z.number().optional(),
        onSuccess: z.string().optional(),
        onFailure: z.string().optional()
    })
});


