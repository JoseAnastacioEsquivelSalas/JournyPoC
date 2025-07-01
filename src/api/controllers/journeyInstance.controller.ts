import { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import { JourneyInstanceService } from '../../services/journeyInstanceService'


export const jump = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folio } = req.params
        const { estadoId, triggeredBy, metadata } = req.body

        if (!estadoId) {
            return res.status(400).json({ message: 'estadoId is required in the request body' })
        }

        const journeyInstanceService = Container.get(JourneyInstanceService)
        const result = await journeyInstanceService.jump(folio, estadoId, { triggeredBy, metadata })

        return res.status(200).json({ message: 'Estado actualizado con éxito', data: result })
    } catch (error) {
        next(error)
    }
}


export const next = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folio } = req.params
        const {triggeredBy, metadata, facts } = req.body

        const journeyInstanceService = Container.get(JourneyInstanceService)
        const result = await journeyInstanceService.next(folio, { triggeredBy, metadata, facts })

        return res.status(200).json({ message: 'Estado actualizado con éxito', data: result })
    } catch (error) {
        next(error)
    }
}


export const getTransitionsByFolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { folio } = req.params

        const journeyInstanceService = Container.get(JourneyInstanceService)
        const result = await journeyInstanceService.getTransitionsByFolio(folio)

        return res.status(200).json({ message: 'Estado actualizado con éxito', data: result })
    } catch (error) {
        next(error)
    }
}
