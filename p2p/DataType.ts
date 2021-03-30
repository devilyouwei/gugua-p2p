// Network data structure
export interface Network {
    readonly name: string
    readonly ip: string
    readonly mac: string
    readonly gateway: string
    readonly netmask: string
    readonly type: string
}
// The data type of P2P seeds (nodes)
export interface Seed {
    readonly address: string
    readonly port: number
    readonly token: string
}
// The standard data structure to exchange message between the P2P nodes
export interface Message {
    readonly status: number
    readonly msg: string
    readonly data: object
}
// 这里可以直接规范一个方法
export interface MessageCallback {
    (msg: string): void
}
// The standard status enums for Message interface
export enum Status {
    ERROR = 0,
    NODE = 1,
    MSG = 2
}
// The standard msg enums for Message interface
export enum Msg {
    ERROR = 'Something is Error',
    NODE = 'Sync Node List',
    MSG = 'Messages'
}
