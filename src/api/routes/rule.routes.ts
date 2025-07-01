import { Router} from "express";
import { validate } from "../middlewares/validate.middleware";
import { AddRuleSchema } from "../validators/rule.validator";
import {addRule, evaluateRule} from '../controllers/rule.controller';

const route = Router();


export default (app: Router) => {

    app.use('/rule', route);

    route.post('/',
        validate(AddRuleSchema),
        addRule
    )

    route.post('/evaluate',
       evaluateRule
    )

}