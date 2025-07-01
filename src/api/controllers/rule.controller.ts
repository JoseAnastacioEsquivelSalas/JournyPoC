import { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import EngineRulesService from '../../services/engineRulesService'



export const addRule = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const ruleService = Container.get(EngineRulesService)

        const { estadoId, jsonRule } = req.body;

        if (!estadoId || !jsonRule) {
            return res.status(400).json({ error: 'estadoId y rule son requeridos' });
        }

        const nuevaRegla = await ruleService.addRule(estadoId, jsonRule);

        res.status(201).json(nuevaRegla);

    } catch (error) {
        next(error)
    }
}

export const evaluateRule = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const ruleService = Container.get(EngineRulesService)

        const { estadoId, facts } = req.body

        if (!facts || typeof facts !== 'object') {
            return res.status(400).json({ message: 'Invalid or missing facts in request body' })
        }

        const data = await ruleService.executeRule(estadoId, facts)

        if (!data || data.length === 0) {
            return res.status(204).send()
        }

        return res.status(200).json({ message: 'Rule evaluation result', data })
    } catch (error) {
        console.error('Error in evaluateRule controller:', error)
        return next(error)
    }
}

