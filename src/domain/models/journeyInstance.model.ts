import { Schema, model, Document } from 'mongoose'
import {IJourneyInstance} from "../interfaces/journeyInstance.interface";
import mongoose from 'mongoose';

const JourneyInstanceSchema = new Schema<IJourneyInstance>(
    {
        folio: { type: String, required: true, unique: true },
        jornadaId: { type: String, required: true },
        estadoActual: {
            estadoId: { type: String, required: true },
            desde: { type: Date, required: true }
        },
        datosContexto: { type: Schema.Types.Mixed },
        finalizada: { type: Boolean, default: false }
    },
    {
        timestamps: true // Crea createdAt y updatedAt automáticamente
    }
);

export default mongoose.model<IJourneyInstance & mongoose.Document>("JourneyInstance", JourneyInstanceSchema)