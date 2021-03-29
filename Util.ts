import network from 'network'
import { Message, Network, Status, Msg } from './test/Data'

export default {
    network(): Promise<Network> {
        return new Promise((resolve, reject) => {
            network.get_interfaces_list((err: Error, list: any[]) => {
                if (err) reject(err)
                if (!list.length) reject('network error')
                const network: Network = {
                    name: list[0].name || '',
                    ip: list[0].ip_address || '',
                    mac: list[0].mac_address || '',
                    gateway: list[0].gateway_ip || '',
                    netmask: list[0].netmask || '',
                    type: list[0].type || ''
                }
                resolve(network)
            })
        })
    },
    parse(json: string): any {
        try {
            return JSON.parse(json)
        } catch (e) {
            return json
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
