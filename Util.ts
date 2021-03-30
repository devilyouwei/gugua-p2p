import network from 'network'
import { Message, Network, Status, Msg } from './p2p/DataType'

export default {
    network(): Promise<Network> {
        return new Promise((resolve, reject) => {
            network.get_interfaces_list((err: Error, list: any[]) => {
                if (err) reject(err)
                if (!list.length) reject('Network Error')
                for (const item of list) {
                    if (item.name && item.ip_address && item.netmask) {
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
    parse(json: string): object {
        try {
            return JSON.parse(json)
        } catch (e) {
            return {}
        }
    },
    stringify(json: any): string {
        try {
            return JSON.stringify(json)
        } catch (e) {
            return ''
        }
    },
    // Messages exchanged in the P2P network need to use this to parse
    json(json: string): Message {
        try {
            return JSON.parse(json) as Message
        } catch (e) {
            return { status: Status.ERROR, msg: Msg.ERROR, data: null }
        }
    }
}
