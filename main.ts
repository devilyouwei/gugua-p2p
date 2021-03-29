import P2P from './test/SmokeP2P'
import { Seed } from './test/Data'

async function main() {
    const node = new P2P()
    const list: Seed[] = []
    list.push({ address: '192.168.2.152', port: 6666 })
    await node.setSeed(list)
    const data = await node.getSeed()
    console.log(data)
}
main()
