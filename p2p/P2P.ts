/*
 * Author: devilyouwei
 * Time: 2021-4-1
 * This is a better P2P lib, suggest to use this!
 */
import Libp2p from 'libp2p'
import TCP from 'libp2p-tcp'
import MPLEX from 'libp2p-mplex'
import { NOISE } from 'libp2p-noise'
import { config } from './p2p.config'
import root from 'app-root-path'
import md5 from 'md5'
import pipe from 'it-pipe'
import concat from 'it-concat'
import $ from './Util'
import { Peer, PeerKey, MessageCallback, Status, Msg, Message } from './DataType'
import DB from '../DB'
import PeerId from 'peer-id'

// p2p util class
export default class P2P {
    private node: Libp2p
    private db: DB
    private interval: NodeJS.Timeout
    private port: number
    private myPeer: Peer[] = []
    constructor() {
        this.db = new DB(`${root}/store/${config.DB}`)
    }
    async getKey(): Promise<PeerId> {
        const keydb = new DB(`${root}/store/${config.KEY}`)
        const keys = await keydb.find()
        let key: PeerKey
        if (keys.length) key = keys[0]
        else {
            // generate a new key
            key = (await PeerId.create({ bits: 1024, keyType: 'RSA' })).toJSON() as PeerKey
            keydb.unique('id')
            await keydb.updateInsert({ id: key.id }, key) // save to local key.db
        }
        return PeerId.createFromJSON(key)
    }
    async startServer(port = 0): Promise<P2P> {
        this.port = port
        const peerid = await this.getKey()
        console.log(peerid)
        // create peer
        this.node = await Libp2p.create({
            peerId: peerid,
            addresses: {
                listen: [`/ip4/0.0.0.0/tcp/${this.port}`]
            },
            modules: {
                transport: [TCP],
                connEncryption: [NOISE],
                streamMuxer: [MPLEX]
            }
        })
        // start peer
        await this.node.start()
        for (const item of this.node.multiaddrs) {
            // save my peer
            this.myPeer.push({
                id: this.node.peerId.toB58String(),
                address: item.toString(),
                token: md5(item.toString()),
                alive: config.ALIVE as number, //initial life
                time: new Date().getTime()
            })
        }
        // save my peer to database
        this.setPeer(this.myPeer)
        // listen other peer heart
        this.startBeat(config.HEART)
        this.listenBeat()
        return this
    }
    stopServer() {
        this.stopBeat()
        this.node.stop()
    }
    startBeat(interval = 0) {
        // heart beat data
        const msg = {
            status: Status.HEART,
            msg: Msg.HEART,
            data: this.myPeer
        }
        // beat only once
        if (interval === 0) this.send('/heart', msg)
        // beat as interval
        else {
            if (this.interval) clearInterval(this.interval) // it is beating? clear!
            this.send('/heart', msg)
            this.interval = setInterval(() => {
                this.send('/heart', msg)
            }, interval)
        }
    }
    stopBeat() {
        if (this.interval) clearInterval(this.interval)
    }
    checkServer(): boolean {
        if (!this.node) return false
        console.log('node has started (true/false):', this.node.isStarted())
        this.node.multiaddrs.forEach(ma => console.log(`${ma.toString()}/p2p/${this.node.peerId.toB58String()}`))
    }
    // save seeds
    async setPeer(peer: Peer[]): Promise<void> {
        if (!peer.length) return
        await this.db.unique('token')
        for (const item of peer) {
            if (item.address.indexOf('127.0.0.1') != -1) continue
            console.log('heart', item.address)
            await this.db.updateInsert({ token: item.token }, item)
        }
    }
    // read seeds
    async getPeer(obj: object = {}): Promise<Peer[]> {
        return await this.db.find(obj) // find all the seeds
    }
    // check is my peer
    isMyPeer(addr: string): boolean {
        const myaddr = this.node.multiaddrs
        for (const item of myaddr) if (item.toString() === addr) return true
        return false
    }
    private listenBeat(): void {
        this.handle('/heart', msg => {
            this.setPeer(msg.data as Peer[])
        })
    }
    // handle message of an action
    handle(action: string, callback: MessageCallback): void {
        this.node.handle(action, async ({ stream }) => {
            const msg = await pipe(stream, concat)
            const str = Buffer.from(msg.toString(), 'base64').toString('utf8')
            callback($.msgParse(str))
        })
    }
    async send(action: string, msg: Message, peer: Peer[] = []): Promise<void> {
        if (!peer.length) peer = await this.getPeer()
        // send my peer to the p2p network(every one)
        for (const item of peer) {
            // skip myself
            if (this.isMyPeer(item.address)) continue
            this.node
                .dialProtocol(`${item.address}/p2p/${item.id}`, action)
                .then(({ stream }) => pipe(Buffer.from($.msgStringify(msg)).toString('base64'), stream))
                .catch(e => {
                    console.log(e)
                    console.log('Disconnect', item.address)
                    this.killPeer(item)
                })
        }
    }
    killPeer(peer: Peer): void {
        if (peer.alive <= 0) {
            this.db.remove({ token: peer.token })
            console.log('remove peer', peer.address)
        } else {
            peer.alive--
            peer.time = new Date().getTime()
            console.log(peer.address, peer.alive)
            this.db.updateInsert({ token: peer.token }, peer)
        }
    }
}
