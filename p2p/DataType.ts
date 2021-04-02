// Specify data types for P2P
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
    readonly time: number
}
export interface Peer {
    readonly id: string
    readonly address: string
    readonly token: string
    time: number
    alive: number
}
export interface PeerKey {
    readonly id: string
    readonly privKey: string
    readonly pubKey: string
    readonly time: number
}
// The standard data structure to exchange message between the P2P nodes
export interface Message {
    readonly status: number
    readonly msg: string
    readonly data: object
}
// 这里可以直接规范一个方法
export interface MessageCallback {
    (msg: Message): void
}
// The standard status enums for Message interface
export enum Status {
    ERROR = 0,
    HEART = 1,
    MSG = 2
}
// The standard msg enums for Message interface
export enum Msg {
    ERROR = 'Something is Error',
    HEART = 'Heart Beat Alive',
    MSG = 'Messages'
}
