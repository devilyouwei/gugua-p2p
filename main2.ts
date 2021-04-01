import P2P from './p2p/P2P'
import rd from 'readline'
import { Status, Msg } from './p2p/DataType'
// use libp2p
async function main() {
    const node = await new P2P(3333).startServer()
    node.checkServer()
    node.handle('/message', res => {
        console.log(res.data)
    })
    // test send message from console
    const rl = rd.createInterface(process.stdin)
    rl.on('line', line => {
        const json = { status: Status.MSG, msg: Msg.MSG, data: { content: line.toString() } }
        node.send('/message', json)
    })
}
main()
