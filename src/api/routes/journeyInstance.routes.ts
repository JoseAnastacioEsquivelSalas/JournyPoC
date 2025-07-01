import {Router} from "express";
import {createJourneyInstance} from "../controllers/journey.controller";
import {getTransitionsByFolio, jump, next} from "../controllers/journeyInstance.controller";

const route = Router()

export default (app: Router) => {

    app.use('/instance', route)

    route.post(
        '/:folio/jump',
        jump
    )

    route.post(
        '/:folio/next',
        next
    )

    route.get(
        '/:folio/transitions',
        getTransitionsByFolio
    )

}