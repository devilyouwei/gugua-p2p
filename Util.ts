import { Message, Network, Status } from './type/DataType'
import { networkInterfaces } from 'os'
import config from './config/web.config'
import BN from 'bn.js'

export default class Util {
    // get local network info
    static getNetworkInfo(): Network[] {
        const net = networkInterfaces()
        const network: Network[] = []
        for (const i in net) {
            for (const j in net[i]) {
                network.push({
                    name: i,
                    ip: net[i][j].address,
                    mac: net[i][j].mac,
                    //gateway: '',
                    netmask: net[i][j].netmask,
                    type: net[i][j].family
                })
            }
        }
        return network
    }
    // parse message
    static msgParse(msg: string): Message {
        try {
            return JSON.parse(msg) as Message
        } catch (e) {
            return { status: Status.ERROR, msg: 'parse message error', data: null }
        }
    }
    // message to string
    static msgStringify(msg: Message): string {
        try {
            return JSON.stringify(msg)
        } catch (e) {
            return `{ status: ${Status.ERROR}, msg: 'stringify message error', data: ${null} }`
        }
    }
    static log(...data: any[]): void {
        if (config.logging) console.log(...data)
    }
    // get a big number from HEX/16 rad
    static BN16(num: string | number): BN {
        if (typeof num == 'string') {
            // string type
            // prefix is '0x'
            if (num.indexOf('x') !== -1) return new BN(num.split('x')[1], 16)
            else return new BN(num, 16)
        } else return new BN(num, 16)
    }
    // get a big number from 10 rad
    static BN10(num: number | string): BN {
        return new BN(num, 10)
    }
}
