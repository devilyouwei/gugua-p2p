import P2P from './p2p/SmokeP2P'
import $ from './Util'
import { Seed, Status, Msg } from './p2p/DataType'
import md5 from 'md5'
import rd from 'readline'
const PORT = 3333

async function main() {
    const network = await $.network()
    const node2 = await new P2P(network, PORT).startServer()
    // add my current seed to database
    const mySeed: Seed = { address: network.ip, port: PORT, token: md5(network.ip + PORT) }
    await node2.setSeed([mySeed])
    console.log('Connecting...')
    node2.onConnect(async () => {
        console.log('Connected!')
        const nodes = await node2.getSeed() // sync node list to other server
        node2.broadcast($.stringify({ status: Status.NODE, msg: Msg.NODE, data: nodes }))
    })
    node2.onDisconnect(() => {
        console.log('Disconnected!')
    })
    node2.onMessage((msg: string) => {
        console.log(msg)
        const json = $.json(msg)
        if (json.status === Status.NODE) node2.setSeed(json.data as Seed[])
    })

    const rl = rd.createInterface(process.stdin)
    rl.on('line', line => {
        const json = { status: Status.NODE, msg: line.toString(), data: [] }
        node2.broadcast($.stringify(json))
    })
}
main()
