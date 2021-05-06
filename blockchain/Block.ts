import db from '../database/DB'
import sha256 from 'sha256'
import { User, UserRegister } from '../database/Entity'
import config from '../config/web.config'
import $ from '../Util'
import BN from 'bn.js'
import { parse } from 'express-form-data'
export default class Block {
    static stop = false
    // get all the blocks
    static async getAll(): Promise<User[]> {
        const repo = await db.t(User)
        return repo.find()
    }
    // check block hash
    static checkHash(block: User, preBlock: User): boolean {
        const check = block.hash === this.hash(block) && block.preHash === preBlock.hash
        $.log('[Check Hash]', check)
        return check
    }
    // check if nonce is right
    static checkNonce(nonce: number, preBlock: User): boolean {
        const hash = sha256(preBlock.hash + nonce)
        const flag = $.BN16(hash).lte($.BN16(preBlock.target))
        $.log('[Check Nonce]', flag)
        return flag
    }
    // count blocks
    static async count(): Promise<number> {
        const repo = await db.t(User)
        return await repo.count()
    }
    // add a block
    static async add(preBlock: User, nonce: number, registers: UserRegister[] = []): Promise<User> {
        // create a new block
        const user = new User()
        user.version = config.VERSION
        user.time = new Date().getTime()
        if (!preBlock) {
            // genesis block
            user.preHash = sha256(config.GENESIS_MSG)
            user.merkle = ''
            user.id = 1
        } else {
            // next block
            user.preHash = preBlock.hash
            user.merkle = ''
            user.id = preBlock.id + 1
        }
        user.target = await this.getTarget() // set next target
        user.registers = registers
        user.nonce = nonce
        user.hash = this.hash(user)
        const repo = await db.t(User) // save to database
        $.log('[Add Block]', `Hash: ${user.hash} nonce: ${nonce}`)
        return repo.save(user)
    }
    // to balance difficulty, get a new target, return hex string
    static async getTarget(): Promise<string> {
        const repo = await db.t(User)
        const data = await repo.find({
            order: {
                time: 'DESC'
            },
            select: ['id', 'time', 'target'],
            take: config.TARGET_SKIP
        })
        if (data.length < config.TARGET_SKIP) return config.GENESIS_TARGET
        // transform hex string to int, calculte a new target
        let target = $.BN16(data[0].target)
        const expectedTime = config.TARGET_TIME * 1000 * data.length
        const realTime = data[0].time - data[data.length - 1].time
        $.log('[Target Deviation]', realTime / expectedTime)
        target = target.muln(realTime / expectedTime)
        return `0x${target.toString(16, 64)}`
    }
    // get current block hash
    static hash(user: User): string {
        const userText =
            user.id.toString() +
            user.preHash.toString() +
            user.target.toString() +
            user.nonce.toString() +
            user.registers.toString() +
            user.time.toString() +
            user.merkle.toString() +
            user.version.toString()
        return sha256(userText)
    }
    // get the latestBlock
    static async latestBlock(): Promise<User> {
        const repo = await db.t(User)
        const res = await repo.findOne({
            order: {
                id: 'DESC'
            },
            relations: ['registers']
        })
        return res
    }
    static async block(id: number | string): Promise<User> {
        const repo = await db.t(User)
        return await repo.findOne(id)
    }
    static async previousBlock(block: User): Promise<User> {
        const repo = await db.t(User)
        let user = new User()
        if (!block || !(block.id - 1)) {
            // the genesis block
            user.id = 0
            user.hash = sha256(config.GENESIS_MSG)
            user.time = 0
            user.target = config.GENESIS_TARGET
        } else {
            // the previous block
            user = await repo.findOne(block.id - 1)
        }
        return user
    }
    // mine, proof of work
    static async mine(preBlock: User = null): Promise<number> {
        let target: BN
        let preHash: string
        let blockId: number
        if (!preBlock) {
            // the genesis block
            blockId = 1
            preHash = sha256(config.GENESIS_MSG)
            target = $.BN16(config.GENESIS_TARGET)
            $.log('[Genesis Block]', `GenesisMsg: ${config.GENESIS_MSG}`)
        } else {
            // the next block
            blockId = preBlock.id + 1
            preHash = preBlock.hash
            target = $.BN16(preBlock.target)
            $.log('[Previous Block]', `PreHash: ${preBlock.hash}`)
        }
        let nonce = 0
        let hash: BN
        $.log('[Mining...]', `Id: ${blockId} Target: 0x${target.toString(16, 64)}`)
        const starttime = new Date().getTime()
        while (!this.stop) {
            hash = $.BN16(sha256(preHash + nonce))
            if (hash.lte(target)) break
            nonce++
        }
        const endtime = new Date().getTime()
        const cost = ((endtime - starttime) / 60 / 1000).toFixed(2)
        $.log('[Mine Result]', `Nonce: ${nonce} TimeCost: ${cost}mins`)
        return nonce
    }
}
