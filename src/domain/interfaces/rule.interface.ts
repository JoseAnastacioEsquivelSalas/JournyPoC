
export interface IJsonRule {
    name: string
    conditions: any
    event: any
    [key: string]: any
}
export interface IRule {
    estadoId: string,
    jsonRule: IJsonRule
}