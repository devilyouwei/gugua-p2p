import db from '../database/DB'
import sha256 from 'sha256'
import { User, UserRegister } from '../database/Entity'
import config from '../config/web.config'
import $ from '../Util'
export default class Block {
    static stop = false
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
        $.log('[Check Nonce]', hash)
        return BigInt(hash) <= BigInt(preBlock.target)
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
        } else {
            user.preHash = preBlock.hash
            user.merkle = ''
        }
        user.target = (await this.getTarget()).toString()
        user.registers = registers
        user.nonce = nonce
        // hash exclude id
        user.hash = this.hash(user)
        const repo = await db.t(User)
        $.log('[Add Result]', `hash:${user.hash} nonce:${nonce}`)
        return repo.save(user)
    }
    // to balance difficulty, get a new target
    static async getTarget(): Promise<BigInt> {
        const repo = await db.t(User)
        const data = await repo.find({
            order: {
                time: 'DESC'
            },
            select: ['id', 'time', 'target'],
            take: config.DIFFICAULTY_SKIP
        })
        if (data.length < config.DIFFICAULTY_SKIP) return BigInt(config.GENESIS_DIFFICAULTY)
        const target = BigInt(data[0].target)
        return target
        /*
        const expectedTime = config.DIFFICAULTY_TIME * 1000 * data.length
        const realTime = data[0].time - data[data.length - 1].time
        target *= realTime / expectedTime
        console.log(target)
        */
    }
    // get current block hash
    static hash(user: User): string {
        const userText =
            user.preHash.toString() +
            user.target.toString() +
            user.nonce.toString() +
            user.registers.toString() +
            user.time.toString() +
            user.merkle.toString() +
            user.version.toString()
        $.log(userText)
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
            user.target = config.GENESIS_DIFFICAULTY
        } else {
            // the previous block
            user = await repo.findOne(block.id - 1)
        }
        return user
    }
    // mine, proof of work
    static async mine(preBlock: User = null): Promise<number> {
        let target: BigInt
        let preHash: string
        let blockId: number
        if (!preBlock) {
            // the genesis block
            blockId = 1
            preHash = sha256(config.GENESIS_MSG)
            target = BigInt(config.GENESIS_DIFFICAULTY)
            $.log('[Genesis Block]', `GenesisMsg:${config.GENESIS_MSG} Nonce:0`)
        } else {
            // the next block
            blockId = preBlock.id + 1
            preHash = preBlock.hash
            target = BigInt(preBlock.target)
            $.log('[Previous Block]', `hash:${preBlock.hash} nonce:${preBlock.nonce}`)
        }
        let nonce = 0
        let hash: BigInt
        $.log('[Mining...]', `Id:${blockId} Target:${target}`)
        const starttime = new Date().getTime()
        while (!this.stop) {
            hash = BigInt(sha256(preHash + nonce))
            if (hash <= target) break
            nonce++
        }
        const endtime = new Date().getTime()
        const cost = (endtime - starttime / 60 / 1000).toFixed(2)
        $.log('[Mine Result]', `Hash:${hash} Nonce:${nonce} TimeCost:${cost}`)
        return nonce
    }
}
