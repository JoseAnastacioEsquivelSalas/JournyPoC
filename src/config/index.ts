import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: process.env.PORT || 3000,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api/v1',
  },
  /**
   * Mailgun email credentials
   */
  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    apiUsername: process.env.MAILGUN_USERNAME,
    domain: process.env.MAILGUN_DOMAIN
  },

  keycloak: {
    clientId: process.env.KEYCLOACK_CLIENT_ID,
    bearerOnly: process.env.KEYCLOACK_BEARER_ONLY,
    serverUrl: process.env.KEYCLOACK_SERVER_URL,
    realm: process.env.KEYCLOACK_REALM,
    realmPublicKey: process.env.KEYCLOACK_REALM_PUBLIC_KEY
  },

  elastic: {
    node: process.env.ELASTIC_NODE,
    activity_log_index: process.env.ACTIVITY_LOG_INDEX
  },
  
  postgresql: {
    database: process.env.POSTGRESQL_DATABASE,
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
  },

  redis: {
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      tls: process.env.REDIS_TLS
    },
    time_to_live: process.env.REDIS_TIME_TO_LIVE
  },

  mongodb: {
    databaseURL: process.env.MONGO_URI || '',
    dbName: process.env.MONGO_DB_NAME || '',
    dbUser: process.env.MONGO_USER || '',
    dbPassword: process.env.MONGO_PASSWORD || '',
    dbAuthSource: process.env.MONGO_AUTH_SOURCE || 'admin',
    dbSSL: process.env.MONGO_SSL === 'true',
    dbSSLCA: process.env.MONGO_SSL_CA || '', // Base64 o ruta a archivo
    dbSSLCert: process.env.MONGO_SSL_CERT || '',
    dbSSLKey: process.env.MONGO_SSL_KEY || '',
    allowInvalidCerts: process.env.MONGO_ALLOW_INVALID_CERTS === 'true'
  },


  ver: process.env.VER

};
