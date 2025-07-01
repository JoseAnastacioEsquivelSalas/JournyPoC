// src/loaders/mongoose.ts

import mongoose, { ConnectOptions } from 'mongoose'
import { Db } from 'mongodb'
import config from '../config'

export default async (): Promise<Db> => {

    const options: ConnectOptions = {
        dbName: config.mongodb.dbName,
        user: config.mongodb.dbUser, // usuario Mongo (si aplica)
        pass: config.mongodb.dbPassword, // contraseña Mongo (si aplica)
        authSource: config.mongodb.dbAuthSource || 'admin', // fuente de autenticación
        ssl: config.mongodb.dbSSL || false, // activar SSL si aplica
        tlsAllowInvalidCertificates: config.mongodb.allowInvalidCerts || false
    }

    try {
        const connection = await mongoose.connect(config.mongodb.databaseURL, options)
        console.log(`🟢 MongoDB conectado a ${config.mongodb.databaseURL}`)
        return connection.connection.db
    } catch (err) {
        console.error('🔴 Error al conectar a MongoDB:', err)
        throw err
    }
}
