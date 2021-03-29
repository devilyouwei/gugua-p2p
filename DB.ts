// Nedb, a local file database based on nodejs
// Before use it, you need to new a DB object
import Database from 'nedb'
export default class DB {
    private db: Nedb
    constructor(file: string) {
        this.db = new Database({ filename: file, autoload: true })
    }
    find(obj: object = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            // Find all documents in the collection
            this.db.find(obj, function (err, docs) {
                if (err) return reject(err)
                resolve(docs)
            })
        })
    }
    // set an index(unique) key for document
    unique(field: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.ensureIndex({ fieldName: field, unique: true }, err => {
                if (err) return reject(err)
                resolve()
            })
        })
    }
    // if a row is not existed, insert, otherwise update it
    updateInsert(key: object, value: object): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.update(key, value, { upsert: true }, err => {
                if (err) return reject(err)
                resolve()
            })
        })
    }
}
