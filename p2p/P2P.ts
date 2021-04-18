/*
 * Author: devilyouwei
 * Time: 2021-4-1
 * This is a better P2P lib, suggest to use this!
 */
import Libp2p from 'libp2p'
import TCP from 'libp2p-tcp'
import MPLEX from 'libp2p-mplex'
import { NOISE } from 'libp2p-noise'
import { config } from '../config/p2p.config'
import root from 'app-root-path'
import md5 from 'md5'
import pipe from 'it-pipe'
import concat from 'it-concat'
import $ from './Util'
import { Peer, MessageCallback, Status, Message } from './DataType'
import DB from '../DB'
import PeerId from 'peer-id'
import crpt from 'libp2p-crypto'
import { Validator } from './Validator'

// p2p util class
export default class P2P {
    private node: Libp2p
    private db: DB
    private username: string
    private password: string
    private interval: NodeJS.Timeout
    private port: number
    private myPeer: Peer[] = []
    constructor(username: string, password: string) {
        this.db = new DB(`${root}/store/${config.PEER_DB}`)
        this.username = username
        this.password = password
    }
    async login(): Promise<PeerId> {
        const keydb = new DB(`${root}/store/${config.KEY_DB}`)
        const keys = await keydb.find()
        let key: PeerId.JSONPeerId
        if (keys.length) key = keys[0]
        else {
            const seed = new Uint8Array(Buffer.from(this.username + this.password, 'utf8'))
            let privKey = await crpt.keys.generateKeyPair('Ed25519', 1024)
            const peerid1 = await PeerId.createFromPrivKey(privKey.bytes)
            console.log('p1', peerid1.toJSON())
            const exp = await privKey.export('123')
            console.log('exp', exp)
            privKey = await crpt.keys.import(exp, '123')
            const peerid = await PeerId.createFromPrivKey(privKey.bytes)
            key = peerid.toJSON()
            console.log('p2', key)
        }
        return PeerId.createFromJSON(key)
    }
    async startServer(port = 0): Promise<P2P> {
        this.port = port
        const peerid = await this.login()
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
            status: Status.SUCCESS,
            msg: 'heart beat',
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
        this.handle('/heart', res => {
            const valid = new Validator().validHeart(res)
            if (valid && res.status === Status.SUCCESS) this.setPeer(res.data as Peer[])
            else throw new Error('validate error: /heart')
        })
    }
    // handle message of an action
    handle(action: string, callback: MessageCallback): void {
        this.node.handle(action, async ({ stream }) => {
            const res = await pipe(stream, concat)
            const str = Buffer.from(res.toString(), 'base64').toString('utf8')
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
