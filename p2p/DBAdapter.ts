import { Adapter } from 'interface-datastore'
import root from 'app-root-path'
import { config } from './p2p.config'
import DB from '../DB'

export default class DBAdapter extends Adapter {
    private db: DB
    constructor() {
        super()
        this.db = new DB(`${root}/store/${config.DB}`)
    }

    async put(key, val): Promise<void> {
        return await this.db.updateInsert(key, val)
    }

    async get(key) {
        return await this.db.find(key)
    }
}
