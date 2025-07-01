import { Schema, model, Document } from 'mongoose'
import {IOperation, IState} from '../interfaces/state.interface'
import {uuidv4} from "zod/v4";


const OperationSchema = new Schema<IOperation>(
    {
            nombre: { type: String, required: true },
            tipo: { type: String, required: true }
    },
    { _id: false } // No queremos _id en subdocumentos simples
);

const StateSchema = new Schema<IState>({
        estadoId: {
                type: String,
                required: true,
                unique: true // ✅ Solo este campo debe ser único
        },
        visible: { type: Boolean, required: true },
        etiqueta: { type: String, required: true },
        grupo: { type: Number, required: true },
        estado: { type: String, required: true },
        jumps: { type: [String], default: [] },
        operaciones: {
                type: [OperationSchema],
                required: true
        },
        reglas: {
                type: [String],
                default: []
        }
});

export default model<IState>('State', StateSchema)

