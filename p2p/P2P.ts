import p2p from 'libp2p'
import TCP from 'libp2p-tcp'
import { NOISE } from 'libp2p-noise'
import MPLEX from 'libp2p-mplex'

// p2p util class
export default class P2P {
    static async createNode() {
        const node = await p2p.create({
            addresses: {
                // To signal the addresses we want to be available, we use
                // the multiaddr format, a self describable address
                listen: ['/ip4/0.0.0.0/tcp/0']
            },
            modules: {
                transport: [TCP],
                connEncryption: [NOISE],
                streamMuxer: [MPLEX]
            }
        })

        await node.start()
        return node
    }
}
