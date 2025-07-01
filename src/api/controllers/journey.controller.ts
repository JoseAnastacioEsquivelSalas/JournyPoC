import { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import { IJourney } from '../../domain/interfaces/journey.interface'
import JourneyService from '../../services/journeyService'
import {IJourneyInstance} from "../../domain/interfaces/journeyInstance.interface";
import {JourneyInstanceService} from "../../services/journeyInstanceService";

export const createJourney = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const journeyData: IJourney = req.body

        if (!journeyData.keyName) {
            return res.status(400).json({ message: 'keyName is required' })
        }

        const journeyService = Container.get(JourneyService)
        const result = await journeyService.createJourney(journeyData)

        return res.status(201).json({ message: 'Journey created successfully', data: result })
    } catch (error) {
        next(error)
    }
}

export const getJourneys = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const journeyService = Container.get(JourneyService)
        const result = await journeyService.getAllJourneys()

        return res.status(200).json({ message: 'Journeys retrieved', data: result })
    } catch (error) {
        next(error)
    }
}

export const getJourneyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const journeyService = Container.get(JourneyService)

        const result = await journeyService.getJourneyById(id)

        if (!result) {
            return res.status(404).json({ message: 'Journey not found' })
        }

        return res.status(200).json({ message: 'Journey retrieved', data: result })
    } catch (error) {
        next(error)
    }
}

export const updateJourney = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const journeyUpdates: Partial<IJourney> = req.body

        const journeyService = Container.get(JourneyService)
        const result = await journeyService.updateJourney(id, journeyUpdates)

        if (!result) {
            return res.status(404).json({ message: 'Journey not found or not updated' })
        }

        return res.status(200).json({ message: 'Journey updated', data: result })
    } catch (error) {
        next(error)
    }
}

export const deleteJourney = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const journeyService = Container.get(JourneyService)

        const deleted = await journeyService.deleteJourney(id)

        if (!deleted) {
            return res.status(404).json({ message: 'Journey not found' })
        }

        return res.status(200).json({ message: 'Journey deleted successfully' })
    } catch (error) {
        next(error)
    }
}


export const createJourneyInstance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instanceData: Partial<IJourneyInstance> = req.body

        if (!instanceData.jornadaId) {
            return res.status(400).json({ message: 'jornadaId' })
        }

        const journeyInstanceService = Container.get(JourneyInstanceService)
        const result = await journeyInstanceService.createInstance(instanceData)

        return res.status(201).json({ message: 'Journey instance created successfully', data: result })
    } catch (error) {
        next(error)
    }
}
