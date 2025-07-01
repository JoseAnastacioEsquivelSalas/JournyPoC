export interface IJourneyTransition {
    folio: string
    servicio: string
    desde: string // idEstado anterior
    hacia: string // idEstado nuevo
    fecha: Date
    triggeredBy?: string
    metadata?: Record<string, any>
    operacion?: string
    facts?: Record<string, any>
}