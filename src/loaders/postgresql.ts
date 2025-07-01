import {Sequelize} from "sequelize";
import config from "../config";

const database = config.postgresql.database
const username = config.postgresql.username
const password = config.postgresql.password
const host = config.postgresql.host
const port = config.postgresql.port

export const sequelize = new Sequelize(database as string, username as string, password,
    {host: host, port: Number(port), dialect: 'postgres'});

module.exports = {
    sequelize
}