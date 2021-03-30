import P2P from './p2p/SmokeP2P'
import $ from './Util'
import { Seed, Status, Msg } from './p2p/DataType'
import md5 from 'md5'
import rd from 'readline'
const PORT = 6666

async function main() {
    const network = await $.network()
    const node = await new P2P(network, PORT).startServer()
    node.checkServer()
    // add my current seed to database
    const mySeed: Seed = { address: network.ip, port: PORT, token: md5(network.ip + PORT) }
    await node.setSeed([mySeed])
    console.log('Connecting...')
    node.onConnect(async () => {
        console.log('Connected!')
        const nodes = await node.getSeed() // sync node list to other server
        // broadcast seeds list
        node.broadcast($.stringify({ status: Status.NODE, msg: Msg.NODE, data: nodes }))
    })
    node.onDisconnect(() => {
        console.log('Disconnected!')
    })
    node.onMessage((msg: string) => {
        const json = $.json(msg)
        if (json.status === Status.NODE) node.setSeed(json.data as Seed[])
        console.log(msg)
    })

    // test send message from console
    const rl = rd.createInterface(process.stdin)
    rl.on('line', line => {
        const json = { status: Status.NODE, msg: line.toString(), data: [] }
        node.broadcast($.stringify(json))
    })
}
main()
