import { Router } from 'express'
import {
    createJourney,
    getJourneys,
    getJourneyById,
    updateJourney,
    deleteJourney,
    createJourneyInstance
} from '../controllers/journey.controller'
import {jump} from "../controllers/journeyInstance.controller";

// Si tienes validaciones, las importas así:
// import validate from '../../middlewares/validate'
// import { CreateJourneySchema, UpdateJourneySchema } from '../schemas/journey.schema'

const route = Router()

export default (app: Router) => {
    app.use('/journey', route)

    // Crear nueva jornada
    route.post(
        '/',
        // validate(CreateJourneySchema), // descomenta si usas validación
        createJourney
    )

    // Obtener todas las jornadas
    route.get('/', getJourneys)

    // Obtener jornada por ID
    route.get('/:id', getJourneyById)

    // Actualizar jornada por ID
    route.put(
        '/:id',
        // validate(UpdateJourneySchema), // descomenta si usas validación
        updateJourney
    )

    // Eliminar jornada por ID
    route.delete('/:id', deleteJourney)

    // Crear instancia de jornada
    route.post(
        '/instantiate',
        // validate(CreateJourneyInstanceSchema), // opcional si usas validación
        createJourneyInstance
    )

}

