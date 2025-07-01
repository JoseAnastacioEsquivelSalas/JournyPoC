import {NextFunction, Router} from 'express';
import {Container} from "typedi"
import rule from "./routes/rule.routes"
import journey from "./routes/journey.routes"
import state from "./routes/state.routes"
import { errorHandler } from "./middlewares/error.middleware"
import journeyInstance from "./routes/journeyInstance.routes";


// guaranteed to get dependencies
export default () => {

	const keycloak : any = Container.get('keycloak');
	const app = Router();

	// Middleware para habilitar CORS
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		next();
	});

	// @ts-ignore
	// app.use(keycloak.middleware());
	rule(app)
	journey(app)
	state(app)
	journeyInstance(app)
	app.use(errorHandler);

	return app
}