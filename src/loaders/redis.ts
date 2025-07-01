import { createClient } from 'redis';
import config from "../config";


const client = createClient({
    username: config.redis.username, // use your Redis user. More info https://redis.io/docs/management/security/acl/
    password: config.redis.password, // use your password here
    // @ts-ignore
    socket: {
        host: config.redis.socket.host,
        port: config.redis.socket.port,
        tls: false,
        reconnectStrategy: function(retries) {
            if (retries > 20) {
                console.log("Too many attempts to reconnect. Redis connection was terminated");
                return new Error("Too many retries.");
            } else {
                return retries * 500;
            }
        }
    }
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

export default client;