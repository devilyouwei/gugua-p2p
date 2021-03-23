import network from 'network'
import { Network } from './test/Data'

export default {
    network() {
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
    }
}
