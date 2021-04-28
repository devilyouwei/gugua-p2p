// Datbase util, some operations to sqlite, use typeorm to map entities and models
// 2021-4-20 change to sqlite and use typeorm
import { createConnection, Connection, EntityTarget, Repository, ConnectionOptions } from 'typeorm'
import * as entities from '../database/Entity'
import config from '../config/db.config'
export default class DB {
    static db: Connection
    // connect to sqlite
    static async connect(): Promise<Connection> {
        config.entities = (() => Object.values(entities))() // import all the entities in Entity.ts
        return (this.db = await createConnection(config as ConnectionOptions))
    }
    // close connect
    static async close(): Promise<void> {
        return this.db.close()
    }
    // choose a table and get repository
    static async t<T>(target: EntityTarget<T>): Promise<Repository<T>> {
        // If disconnected, force to connect
        if (!this.db || !this.db.isConnected) await this.connect()
        return this.db.getRepository(target)
    }
}
