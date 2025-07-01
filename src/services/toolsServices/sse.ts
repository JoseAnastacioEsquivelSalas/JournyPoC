import {Container, Service} from "typedi";
import {IsseClient} from "../../domain/interfaces/IsseClient";

@Service()
export default class SSEService {

    private sseClients: any;

    constructor() {
        this.sseClients = Container.get("sseClients") as IsseClient[]
    }

    public  addClient (res: any, uuid: string){
        const newClient: IsseClient = {
            id: uuid,
            res: res,
        };
        this.sseClients.push(newClient)
        return true
    }

    public async getClientById(clientId: string): Promise<{id:string, res: any}>{
        const found = this.sseClients.find((element : IsseClient) => element.id === clientId)
        return found
    }

    public async sendToUser(clientId: string, msg: any): Promise<any>  {
        const client = await this.getClientById(clientId)
        const sendData = `data: ${JSON.stringify(msg)}\n\n`
        client.res.write(sendData)
        return true
    }

    public async closeClient(clientId: string): Promise<boolean> {
        this.sseClients = this.sseClients.filter((element : IsseClient) => element.id !== clientId);
        return true
    }

    private genUniqId(){
        return Date.now() + '-' + Math.floor(Math.random() * 1000000000);
    }

}