import network from 'network'
import { Message, Network, Status, Msg } from './DataType'

export default {
    network(): Promise<Network> {
        return new Promise((resolve, reject) => {
            network.get_interfaces_list((err: Error, list: any[]) => {
                if (err) reject(err)
                if (!list.length) reject('Network Error')
                for (const item of list) {
                    if (item.name && item.ip_address && item.netmask && item.mac) {
                        const network: Network = {
                            name: item.name,
                            ip: item.ip_address,
                            mac: item.mac_address,
                            gateway: item.gateway_ip,
                            netmask: item.netmask,
                            type: item.type
                        }
                        resolve(network)
                    }
                }
            })
        })
    },
    // parse message
    msgParse(msg: string): Message {
        try {
            return JSON.parse(msg) as Message
        } catch (e) {
            return { status: Status.ERROR, msg: Msg.ERROR, data: null }
        }
    },
    // message to string
    msgStringify(msg: Message): string {
        try {
            return JSON.stringify(msg)
        } catch (e) {
            return `{ status: ${Status.ERROR}, msg: ${Msg.ERROR}, data: ${null} }`
        }
    }
}
