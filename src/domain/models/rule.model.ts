import { Schema, model, Document } from 'mongoose';
import {IState} from "../interfaces/state.interface";
import {IRule} from "../interfaces/rule.interface";

// Interfaces


// Esquema
const RuleSchema = new Schema<IRule>({
    estadoId: { type: String, required: true },
    jsonRule: { type: Schema.Types.Mixed, required: true } // Puede contener cualquier estructura JSON
});

// Modelo


export default model<IRule>('Rule', RuleSchema)
