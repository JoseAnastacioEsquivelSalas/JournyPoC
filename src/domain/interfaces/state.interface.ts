
export interface IOperation {
    nombre: string;
    tipo: string;
}

export interface IState {
    estadoId: string
    visible: boolean
    etiqueta: string
    grupo: number
    estado: string
    jumps: string[]
    operaciones: IOperation[]
    reglas: string[]
}

