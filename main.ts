import P2P from './p2p/P2P'
import rd from 'readline'
import { Status } from './p2p/DataType'
// use libp2p
async function main() {
    const node = await new P2P('huangyouwei','huangyouwei').startServer(6666)
    node.checkServer()
    node.handle('/message', res => {
        console.log(res.data)
    })
    // test send message from console
    const rl = rd.createInterface(process.stdin)
    rl.on('line', line => {
        const json = { status: Status.SUCCESS, msg: 'send a message', data: { content: line.toString() } }
        node.send('/message', json)
    })
}
main()
