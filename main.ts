import P2P from './p2p/SmokeP2P'
import $ from './p2p/Util'
import { Status, Msg, Message } from './p2p/DataType'
import rd from 'readline'
const PORT = 6666

async function main() {
    const network = await $.network()
    const node = await new P2P(network, PORT).startServer()
    node.checkServer()
    console.log('Connecting...')
    node.onConnect(() => {
        console.log('Connected!')
        // broadcast heartRate once upon connected
        node.heartRate()
    })
    node.onDisconnect(() => console.log('Disconnected!'))
    node.onMessage((msg: Message) => {
        console.log(msg.data)
    })

    // test send message from console
    const rl = rd.createInterface(process.stdin)
    rl.on('line', line => {
        const json = { status: Status.MSG, msg: Msg.MSG, data: { content: line.toString(), from: network.ip } }
        node.broadcast($.msgStringify(json))
    })
}
main()
