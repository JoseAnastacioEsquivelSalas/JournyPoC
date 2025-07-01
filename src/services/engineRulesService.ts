import {Service, Inject, Container} from 'typedi'
import { Logger } from 'winston'
import {Model} from "mongoose";
import {IJsonRule, IRule} from "../domain/interfaces/rule.interface";
import {IState} from "../domain/interfaces/state.interface";
import {Engine} from "json-rules-engine";



interface Facts {
    [key: string]: any
}

interface RulesEngine {
    addRule(rule: IJsonRule): Promise<void>
    run(facts: Facts): Promise<{ events: { params: any }[] }>
}

@Service()
export default class EngineRulesService {
    constructor(
        @Inject('logger') private logger: Logger,
        @Inject('ruleModel') private ruleModel: Model<IRule>,
        @Inject('stateModel') private stateModel: Model<IState>
    ) {}

    /**
     * Agrega una nueva regla al motor.
     */
    public async addRule(estadoId: string, rule: IJsonRule): Promise<IRule> {

            // Verificar si ya existe una regla con el mismo estadoId y rule.name
        const existe = await this.ruleModel.findOne({
            estadoId: estadoId,
            'jsonRule.name': rule.name
        });

        if (existe) {
            this.logger.warn(`⚠️ Ya existe una regla con estadoId "${estadoId}" y nombre "${rule.name}". No se creó una nueva.`);
            throw new Error(`Regla duplicada: ya existe una regla con estadoId "${estadoId}" y nombre "${rule.name}".`);
        }

        const nuevaRegla = new this.ruleModel({ estadoId: estadoId, jsonRule: rule });
        const guardada = await nuevaRegla.save();

        this.logger.info(`✌️ Regla "${rule.name}" almacenada exitosamente.`);
        return guardada;

    }


    /**
     * Ejecuta las reglas con los hechos recibidos y devuelve el último evento, si existe.
     */
    public async executeRule(estadoId: string, facts: Facts): Promise<any> {

        const engine = new Engine()

        //Buscar el estado
        const estado = await this.stateModel.findOne({ estadoId }).lean()
        if (!estado) {
            this.logger.warn(`⚠️ Estado con ID "${estadoId}" no encontrado.`)
            return null
        }

        // Obtener las reglas desde el campo `reglas`
        const reglasStr = estado.reglas || []
        if (reglasStr.length === 0) {
            this.logger.warn(`⚠️ No se encontraron reglas en el estado "${estadoId}".`)
            return null
        }

        // Buscar reglas por su nombre
        const reglas = await this.ruleModel.find({ 'jsonRule.name': { $in: reglasStr } }).lean()
        if (!reglas || reglas.length === 0) {
            this.logger.warn(`⚠️ No se encontraron reglas con nombres: ${reglasStr.join(', ')}`)
            return null
        }

        // Agregar reglas al motor
        for (const regla of reglas) {
            try {
                engine.addRule(regla.jsonRule)
            } catch (error) {
                this.logger.error(`❌ Error al agregar la regla "${regla.jsonRule.name}": ${error}`)
            }
        }

        // Ejecutar el motor con los facts proporcionados
        const results = await engine.run(facts)

        this.logger.info(`✔️ Reglas ejecutadas con éxito para estado "${estadoId}"`)

        // Retornar el último evento, o todos si lo prefieres
        const lastEvent = results.events?.at(-1)?.params ?? null
        return lastEvent
    }

}
