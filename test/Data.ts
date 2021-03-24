export interface Network {
    readonly name: string
    readonly ip: string
    readonly mac: string
    readonly gateway: string
    readonly netmask: string
    readonly type: string
}
export interface Seed {
    readonly address: string
    readonly port: number
}
