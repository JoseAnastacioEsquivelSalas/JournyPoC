import { Router } from 'express'
import {
    createState,
    getStates,
    getStateById,
    updateState,
    deleteState
} from '../controllers/state.controller'

// Si tienes validadores con Joi o Zod, los importas así:
// import validate from '../../middlewares/validate'
// import { CreateStateSchema, UpdateStateSchema } from '../schemas/state.schema'

const route = Router()

export default (app: Router) => {
    app.use('/state', route)

    // Crear nuevo estado
    route.post(
        '/',
        // validate(CreateStateSchema), // descomenta si usas validación
        createState
    )

    // Listar todos los estados
    route.get('/', getStates)

    // Obtener estado por ID
    route.get('/:id', getStateById)

    // Actualizar estado por ID
    route.put(
        '/:id',
        // validate(UpdateStateSchema), // descomenta si usas validación
        updateState
    )

    // Eliminar estado por ID
    route.delete('/:id', deleteState)
}
