import { Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import StateService from '../../services/stateService'
import { IState } from '../../domain/interfaces/state.interface'

export const createState = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stateService = Container.get(StateService)
        const stateData: IState = req.body

        if (!stateData.estado) {
            return res.status(400).json({ message: 'El campo "estado" es obligatorio.' })
        }

        const result = await stateService.createState(stateData)
        return res.status(201).json({ message: 'Estado creado exitosamente', data: result })
    } catch (error) {
        next(error)
    }
}

export const getStates = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const stateService = Container.get(StateService)
        const result = await stateService.getAllStates()
        return res.status(200).json({ message: 'Estados obtenidos exitosamente', data: result })
    } catch (error) {
        next(error)
    }
}

export const getStateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const stateService = Container.get(StateService)

        const result = await stateService.getStateById(id)
        if (!result) {
            return res.status(404).json({ message: 'Estado no encontrado' })
        }

        return res.status(200).json({ message: 'Estado obtenido exitosamente', data: result })
    } catch (error) {
        next(error)
    }
}

export const updateState = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const updates: Partial<IState> = req.body
        const stateService = Container.get(StateService)

        const result = await stateService.updateState(id, updates)
        if (!result) {
            return res.status(404).json({ message: 'Estado no encontrado o no actualizado' })
        }

        return res.status(200).json({ message: 'Estado actualizado exitosamente', data: result })
    } catch (error) {
        next(error)
    }
}

export const deleteState = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const stateService = Container.get(StateService)

        const deleted = await stateService.deleteState(id)
        if (!deleted) {
            return res.status(404).json({ message: 'Estado no encontrado' })
        }

        return res.status(200).json({ message: 'Estado eliminado exitosamente' })
    } catch (error) {
        next(error)
    }
}
