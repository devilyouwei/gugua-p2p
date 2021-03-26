import P2P from './test/SmokeP2P'
import { Seed } from './test/Data'

async function main() {
    const node = new P2P()
    const list: Seed[] = []
    list.push({ address: '192.168.2.150', port: 6666 })
    node.setSeed(list)
}
main()
