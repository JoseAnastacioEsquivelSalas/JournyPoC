import { Schema, model, Document } from 'mongoose'
import {IJourney} from "../interfaces/journey.interface";
import mongoose from 'mongoose';
import {IJourneyTransition} from "../interfaces/journeyTransition.interface";
import {IState} from "../interfaces/state.interface";

const JourneyTransitionSchema = new Schema<IJourneyTransition>({
    folio: { type: String, required: true, index: true },
    servicio: {type: String, required: true},
    desde: { type: String, required: true },
    hacia: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    operacion: {type: String, default: ""},
    triggeredBy: { type: String }, // usuario o sistema
    metadata: { type: Schema.Types.Mixed },
    facts: {type: Schema.Types.Mixed }// info extra como canal, razón, etc.
})

export default model<IJourneyTransition>('JourneyTransition', JourneyTransitionSchema)