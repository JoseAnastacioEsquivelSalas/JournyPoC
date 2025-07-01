import config from "../config";
var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak: any;

var keycloakConfig = {
    clientId: config.keycloak.clientId,
    bearerOnly: config.keycloak.bearerOnly,
    serverUrl: config.keycloak.serverUrl,
    realm: config.keycloak.realm,
    realmPublicKey: config.keycloak.realmPublicKey
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
    _keycloak = initKeycloak()
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    }
    return _keycloak;
}

module.exports = {
    getKeycloak
};