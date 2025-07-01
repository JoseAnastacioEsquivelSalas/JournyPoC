// src/models/journey.model.ts

import { Schema, model, Document } from 'mongoose'
import {IJourney} from "../interfaces/journey.interface";
import mongoose from 'mongoose';


const JourneySchema: Schema = new Schema<IJourney>(
    {
        jornadaId: { type: String, required: true, unique: true },
        jornada: { type: String, required: true },
        keyName: { type: String, required: true },
        descripcion: { type: String },
        objetivo: { type: String },

        estadoInicial: {
            estadoId: { type: String, required: true }
        },

        estadoObjetivo: {
            estadoId: { type: String, required: true }
        },

        tags: [{ type: String }],
        aplicaciones: [{ type: String }]
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IJourney & mongoose.Document>("Journey", JourneySchema)
