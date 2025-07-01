
export interface IJourney {
    jornadaId: string
    jornada: string
    keyName: string
    descripcion?: string
    objetivo?: string

    estadoInicial: {
        estadoId: string
    }

    estadoObjetivo: {
        estadoId: string
    }

    tags?: string[]
    aplicaciones?: string[]

    createdAt?: Date
    updatedAt?: Date
}
