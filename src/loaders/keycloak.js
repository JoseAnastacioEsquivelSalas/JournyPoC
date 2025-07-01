"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
var session = require('express-session');
var Keycloak = require('keycloak-connect');
let _keycloak;
var keycloakConfig = {
    clientId: config_1.default.keycloak.clientId,
    bearerOnly: config_1.default.keycloak.bearerOnly,
    serverUrl: config_1.default.keycloak.serverUrl,
    realm: config_1.default.keycloak.realm,
    realmPublicKey: config_1.default.keycloak.realmPublicKey
};
function initKeycloak() {
    if (_keycloak) {
        console.warn("Trying to init Keycloak again!");
        return _keycloak;
    }
    else {
        console.log("Initializing Keycloak...");
        var memoryStore = new session.MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}
function getKeycloak() {
    _keycloak = initKeycloak();
    if (!_keycloak) {
        console.error('Keycloak has not been initialized. Please called init first.');
    }
    return _keycloak;
}
module.exports = {
    getKeycloak
};
