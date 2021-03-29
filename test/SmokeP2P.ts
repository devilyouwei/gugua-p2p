import smoke from 'smokesignal'
import root from 'app-root-path'
import { Network, Seed } from './Data'
import DB from '../DB'
import through2 from 'through2'
const PORT = 6666
const FILE = `${root}/store/p2p.db`

export default class SmokeP2P {
    private db: DB
    private node: any
    private network: Network
    private port: number
    constructor(network: Network, port: number = PORT) {
        this.db = new DB(FILE)
        this.network = network
        this.port = port
    }
    // save seeds
    async setSeed(list: Seed[]): Promise<void> {
        if (!list.length) return
        await this.db.unique('token') // set token unique, token=md5(ip+port)
        for (const item of list) await this.db.updateInsert({ token: item.token }, item)
    }
    // read seeds
    async getSeed(obj: object = {}): Promise<Seed[]> {
        return await this.db.find(obj) // find all the seeds
    }
    // start as a p2p server, return the node
    async startServer(seeds: Seed[] = []): Promise<SmokeP2P> {
        // if no seeds, read from local database
        if (!seeds.length) seeds = await this.getSeed()
        this.node = smoke.createNode({
            port: this.port,
            address: smoke.localIp(`${this.network?.ip}/${this.network?.netmask}`),
            seeds: seeds
        })
        // really start server
        this.node.start()
        return this
    }
    // check server infomation
    // must be executed after start server, return the node
    checkServer(): any {
        console.log('Port:', this.node?.options.port)
        console.log('IP:', this.node?.options.address)
        console.log('ID:', this.node?.id)
        return this.node
    }
    // upon connected, it triggers
    onConnect(callback: Function): void {
        this.node?.on('connect', callback)
    }
    // upon disconnect, it triggers
    onDisconnect(callback: Function): void {
        this.node?.on('disconnect', callback)
    }
    // close p2p server
    closeServer(): void {
        this.node?.close()
    }
    // broadcast a message
    broadcast(msg: string): void {
        this.node?.broadcast.write(msg)
    }
    // on message arrives
    onMessage(callback: Function): void {
        this.node?.broadcast.pipe(
            through2((line, _, next) => {
                callback(line.toString())
                next(null, line)
            })
        )
    }
}
