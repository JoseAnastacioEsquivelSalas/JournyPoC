export interface IJourneyInstance {
    instanciaId: string; // UUID o similar, identificador técnico único
    folio: string;       // Identificador legible, único por instancia
    jornadaId: string;   // Referencia al modelo de jornada
    estadoActual: {
        estadoId: string;
        desde: Date;       // Fecha en que entró en el estado actual
    };
    datosContexto?: Record<string, any>; // Datos opcionales de negocio asociados a la instancia
    finalizada?: boolean;                // True si llegó al estado objetivo
    createdAt?: Date;                    // Agregado por timestamps
    updatedAt?: Date;                    // Agregado por timestamps
}