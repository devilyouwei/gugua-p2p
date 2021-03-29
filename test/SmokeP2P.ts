import smoke from 'smokesignal'
import root from 'app-root-path'
import { Network, Seed } from './Data'
import through from 'through2'
import DB from '../DB'

export default class SmokeP2P {
    db: DB
    constructor() {
        const file = `${root}/store/p2p.db`
        this.db = new DB(file)
    }
    // save seeds, list it the seeds need to be saved
    async setSeed(list: Seed[]): Promise<void> {
        if (!list.length) return
        await this.db.unique('address')
        for (const item of list) await this.db.updateInsert({ address: item.address }, item)
    }
    async getSeed(): Promise<Seed[]> {
        const data = await this.db.find() // find all the seeds
        return data
    }
}
