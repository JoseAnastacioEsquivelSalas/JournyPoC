import { Service, Inject } from 'typedi'
import { Model } from 'mongoose'
import { IState } from '../domain/interfaces/state.interface'
import { Logger } from 'winston'

@Service()
export default class StateService {
    constructor(
        @Inject('stateModel') private stateModel: Model<IState>,
        @Inject('logger') private logger: Logger
    ) {}

    /**
     * Crea un nuevo estado
     */
    public async createState(data: IState): Promise<IState> {
        const jumps = data.jumps;

        // Validar que todos los jumps existan en la base de datos
        if (jumps && jumps.length > 0) {
            const existingStates = await this.stateModel.find({ estadoId: { $in: jumps } }).select('estadoId');

            const existingIds = existingStates.map((s) => s.estadoId);
            const missingIds = jumps.filter((id) => !existingIds.includes(id));

            if (missingIds.length > 0) {
                throw new Error(`Los siguientes estadoId de jumps no existen: ${missingIds.join(', ')}`);
            }
        }

        // Crear y guardar el nuevo estado
        const newState = new this.stateModel(data);
        return await newState.save();
    }

    /**
     * Lista todos los estados
     */
    public async getAllStates(): Promise<IState[]> {
        try {
            this.logger.info('Obteniendo todos los estados')
            return await this.stateModel.find().lean()
        } catch (error) {
            this.logger.error(`Error al obtener los estados: ${error.message}`)
            throw error
        }
    }

    /**
     * Obtiene un estado por su ID
     */
    public async getStateById(id: string): Promise<IState | null> {
        try {
            this.logger.info(`Buscando estado con ID: ${id}`)
            return await this.stateModel.findById(id).lean()
        } catch (error) {
            this.logger.error(`Error al obtener el estado por ID: ${error.message}`)
            throw error
        }
    }

    /**
     * Actualiza un estado por ID
     */
    public async updateState(id: string, update: Partial<IState>): Promise<IState | null> {
        try {
            this.logger.info(`Actualizando estado con ID: ${id}`)
            return await this.stateModel.findByIdAndUpdate(id, update, { new: true }).lean()
        } catch (error) {
            this.logger.error(`Error al actualizar el estado: ${error.message}`)
            throw error
        }
    }

    /**
     * Elimina un estado por ID
     */
    public async deleteState(id: string): Promise<boolean> {
        try {
            this.logger.info(`Eliminando estado con ID: ${id}`)
            const result = await this.stateModel.findByIdAndDelete(id)
            return !!result
        } catch (error) {
            this.logger.error(`Error al eliminar el estado: ${error.message}`)
            throw error
        }
    }
}
