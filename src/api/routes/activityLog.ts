import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import {HttpStatusCode} from "../middlewares/errorHandling";
import ActivityLogsService from "../../services/activityLogsService";
import {IActivityLog} from "../../domain/interfaces/IActivityLog";

const route = Router();

export default (app: Router) => {

    const keycloak: any = Container.get('keycloak');
    const activityLogsService = Container.get(ActivityLogsService)

    app.use('/activityLog', route);

    // @ts-ignore
    route.post('/',

        async (req: Request, res: Response, next: NextFunction) => {

            let response: any
            const logger: any = Container.get('logger')

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'];

            let activityLog : IActivityLog = {
                company_id: req.body.company_id,
                user_id : req.body.user_id,
                username: req.body.username,
                action: req.body.action,
                module: req.body.module,
                status: req.body.status,
                ip_address: ip as string,
                user_agent: userAgent as string,
                details: req.body.details,
                date: new Date().toString(),
                timestamp_utc: new Date().toISOString()
            }

           logger.debug(`Recibido....${JSON.stringify(activityLog)}`)

           let data: any = await activityLogsService.saveLog(activityLog)

            if (data.length === 0){
                response = {
                    status: HttpStatusCode.NO_CONTENT,
                    message: 'No content',
                    data: data
                }
            } else {
                response = {
                    status: HttpStatusCode.OK,
                    message: 'Ok',
                    data: data
                }
            }
            return res.status(HttpStatusCode.OK).json(response);

        }
    );
}