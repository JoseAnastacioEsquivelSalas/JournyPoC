"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
const database = config_1.default.postgresql.database;
const username = config_1.default.postgresql.username;
const password = config_1.default.postgresql.password;
const host = config_1.default.postgresql.host;
const port = config_1.default.postgresql.port;
exports.sequelize = new sequelize_1.Sequelize(database, username, password, { host: host, port: Number(port), dialect: 'postgres' });
module.exports = {
    sequelize: exports.sequelize
};
