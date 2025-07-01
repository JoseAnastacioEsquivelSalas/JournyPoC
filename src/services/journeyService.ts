import { Service, Inject } from 'typedi'
import { Model } from 'mongoose'
import { IJourney } from '../domain/interfaces/journey.interface'
import {IState} from "../domain/interfaces/state.interface";

@Service()
export default class JourneyService {
    constructor(
        @Inject('journeyModel') private journeyModel: Model<IJourney>,
        @Inject('stateModel') private stateModel: Model<IState>,
        @Inject('logger') private logger: any
    ) {}

    public async createJourney(journeyData: IJourney): Promise<IJourney> {
        const { estadoInicial, estadoObjetivo } = journeyData

        // Verificar que estadoObjetivo existe
        const initState = await this.stateModel.findOne({estadoId: estadoInicial.estadoId}).lean()
        if (!initState) {
            this.logger.warn(`Estado inicial con ID ${estadoObjetivo.estadoId} no existe`)
            throw new Error('El estado inicial no existe')
        }

        // Verificar que estadoObjetivo existe
        const goalState = await this.stateModel.findOne({estadoId: estadoObjetivo.estadoId}).lean()
        if (!goalState) {
            this.logger.warn(`Estado objetivo con ID ${estadoObjetivo.estadoId} no existe`)
            throw new Error('El estado objetivo no existe')
        }

        // Crear la jornada si el estado es válido
        const journey = new this.journeyModel(journeyData)
        return journey.save()
    }

    public async getAllJourneys(): Promise<IJourney[]> {
        try {
            this.logger.info('Fetching all journeys...')
            return await this.journeyModel.find().lean()
        } catch (error) {
            this.logger.error('Error fetching journeys', error)
            throw error
        }
    }

    public async getJourneyById(id: string): Promise<IJourney | null> {
        try {
            this.logger.info(`Fetching journey with ID: ${id}`)
            return await this.journeyModel.findById(id).lean()
        } catch (error) {
            this.logger.error(`Error fetching journey by ID: ${id}`, error)
            throw error
        }
    }

    public async updateJourney(id: string, update: Partial<IJourney>): Promise<IJourney | null> {
        try {
            this.logger.info(`Updating journey with ID: ${id}`)
            return await this.journeyModel.findByIdAndUpdate(id, update, { new: true }).lean()
        } catch (error) {
            this.logger.error(`Error updating journey with ID: ${id}`, error)
            throw error
        }
    }

    public async deleteJourney(id: string): Promise<boolean> {
        try {
            this.logger.info(`Deleting journey with ID: ${id}`)
            const result = await this.journeyModel.findByIdAndDelete(id)
            return !!result
        } catch (error) {
            this.logger.error(`Error deleting journey with ID: ${id}`, error)
            throw error
        }
    }
}
