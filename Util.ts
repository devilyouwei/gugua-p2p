import { Message, Network, Status } from './type/DataType'
import { networkInterfaces } from 'os'

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
}
