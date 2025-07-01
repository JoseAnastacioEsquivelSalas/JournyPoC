import {Container, Inject, Service} from 'typedi'
import { v4 as uuidv4 } from 'uuid'
import { IJourneyInstance } from '../domain/interfaces/journeyInstance.interface'
import {Model} from "mongoose";
import {IJourney} from "../domain/interfaces/journey.interface";
import {IState} from "../domain/interfaces/state.interface";
import {IJourneyTransition} from "../domain/interfaces/journeyTransition.interface";
import EngineRulesService from "./engineRulesService";
import {evaluateRule} from "../api/controllers/rule.controller";

@Service()
export class JourneyInstanceService {

    private engineRuleService: EngineRulesService

    constructor(
        @Inject('journeyModel') private journeyModel: Model<IJourney>,
        @Inject('journeyInstanceModel') private journeyInstanceModel: Model<IJourneyInstance>,
        @Inject('stateModel') private stateModel: Model<IState>,
        @Inject('journeyTransitionModel') private journeyTransationModel: Model<IJourneyTransition>,
        @Inject('logger') private logger: any
    ) {
        this.engineRuleService = Container.get(EngineRulesService)
    }
    /**
     * Crea una instancia de una jornada
     * @param data Información parcial de la instancia (sin idInstancia ni folio)
     */
    async createInstance(data: Partial<IJourneyInstance>): Promise<IJourneyInstance> {
        const { jornadaId, datosContexto } = data

        // Validación de idJornada
        if (!jornadaId) {
            throw new Error('idJornada es requerido')
        }

        // Buscar la jornada y validar existencia
        const jornada = await this.journeyModel.findOne({ jornadaId: jornadaId }).lean()
        if (!jornada) {
            throw new Error(`La jornada con id "${jornadaId}" no existe`)
        }

        // Obtener id del estado inicial
        const idEstadoInicial = jornada.estadoInicial?.estadoId
        if (!idEstadoInicial) {
            throw new Error(`La jornada "${jornadaId}" no tiene un estadoInicial configurado`)
        }

        // Validar existencia del estado inicial
        const estadoInicial = await this.stateModel.findOne({ estadoId: idEstadoInicial })
        if (!estadoInicial) {
            throw new Error(`El estado inicial "${idEstadoInicial}" no existe`)
        }

        // Generar folio único
        const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const secuencia = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        const folio = `JRN-${fecha}-${secuencia}`

        // Crear la instancia de jornada
        const newInstance = new this.journeyInstanceModel({
            idInstancia: uuidv4(),
            folio,
            jornadaId,
            estadoActual: {
                estadoId: idEstadoInicial,
                desde: new Date()
            },
            datosContexto,
            finalizada: false
        })

        return await newInstance.save()
    }

    async jump(
        folio: string,
        _estadoDestino: string,
        options?: { triggeredBy?: string; metadata?: Record<string, any> }
    ): Promise<IJourneyInstance> {
        // Buscar la instancia
        const instancia = await this.journeyInstanceModel.findOne({ folio })
        if (!instancia) {
            throw new Error(`La instancia de jornada con folio ${folio} no existe`)
        }

        //Validamos si la instancia esta finalizada
        if (instancia.finalizada) {
            throw new Error(`La instancia de jornada con folio ${folio} esta finalizada`)
        }

        const estadoActualId = instancia.estadoActual.estadoId

        // Verificar que el estado actual existe
        const estadoActual = await this.stateModel.findOne({ estadoId: estadoActualId })
        if (!estadoActual) {
            throw new Error(`El estado actual "${estadoActualId}" no existe`)
        }

        // Validar si el estado destino está dentro de los jumps permitidos
        if (!estadoActual.jumps.includes(_estadoDestino)) {
            throw new Error(`La transición de "${estadoActualId}" a "${_estadoDestino}" no está permitida`)
        }

        // Verificar que el estado destino exista
        const estadoDestino = await this.stateModel.findOne({ estadoId: _estadoDestino }).lean()
        if (!estadoDestino) {
            throw new Error(`El estado destino "${_estadoDestino}" no existe`)
        }

        // Guardar la transición
        await this.journeyTransationModel.create({
            folio,
            servicio: 'jump',
            desde: estadoActualId,
            hacia: estadoDestino.estadoId,
            fecha: new Date(),
            triggeredBy: options?.triggeredBy,
            metadata: options?.metadata
        })

        // Actualizar instancia
        instancia.estadoActual = {
            estadoId: _estadoDestino,
            desde: new Date()
        }

        // Si es el estado objetivo de la jornada, marcar como finalizada
        const jornada = await this.journeyModel.findOne({ jornadaId: instancia.jornadaId }).lean()
        if (jornada.estadoObjetivo.estadoId === _estadoDestino) {
            instancia.finalizada = true
        }

        await instancia.save()

        return instancia
    }

    async next(
        folio: string,
        options?: { triggeredBy?: string; metadata?: Record<string, any>;  facts?: Record<string, any>}
    ): Promise<IJourneyInstance> {

        // Buscar la instancia
        const instancia = await this.journeyInstanceModel.findOne({ folio })
        if (!instancia) {
            throw new Error(`La instancia de jornada con folio ${folio} no existe`)
        }

        //Validamos si la instancia esta finalizada
        if (instancia.finalizada) {
            throw new Error(`La instancia de jornada con folio ${folio} esta finalizada`)
        }

        const estadoActualId = instancia.estadoActual.estadoId

        // Verificar que el estado actual existe
        const estadoActual = await this.stateModel.findOne({ estadoId: estadoActualId })
        if (!estadoActual) {
            throw new Error(`El estado actual "${estadoActualId}" no existe`)
        }

        const ruleResult = await this.engineRuleService.executeRule(estadoActual.estadoId, options.facts)
        if (!ruleResult) {
            throw new Error(`No fue posible definir un resultado para ${JSON.stringify(options.facts)} `)
        }


        // Verificar que el estado destino exista
        const estadoDestino = ruleResult.estadoId
        if (!estadoDestino) {
            throw new Error(`El estado destino "${ruleResult.estadoId}" no existe`)
        }

        // Guardar la transición
        await this.journeyTransationModel.create({
            folio,
            servicio: 'next',
            desde: estadoActualId,
            hacia: estadoDestino,
            fecha: new Date(),
            triggeredBy: options?.triggeredBy,
            metadata: options?.metadata,
            facts: options?.facts,
            operacion: ruleResult?.operacion
        })

        // Actualizar instancia
        instancia.estadoActual = {
            estadoId: estadoDestino,
            desde: new Date()
        }

        // Si es el estado objetivo de la jornada, marcar como finalizada
        const jornada = await this.journeyModel.findOne({ jornadaId: instancia.jornadaId }).lean()
        if (jornada.estadoObjetivo.estadoId === estadoDestino) {
            instancia.finalizada = true
        }

        await instancia.save()

        return instancia
    }

    public async getTransitionsByFolio(folio: string): Promise<IJourneyTransition[]> {
        if (!folio || folio.trim() === '') {
            throw new Error('Folio requerido para consultar transiciones')
        }

        const transiciones = await this.journeyTransationModel
            .find({ folio })
            .sort({ fecha: 1 }) // Opcional: orden cronológico
            .lean()

        if (!transiciones || transiciones.length === 0) {
            this.logger.warn(`⚠️ No se encontraron transiciones para el folio "${folio}"`)
        }

        return transiciones
    }


}
