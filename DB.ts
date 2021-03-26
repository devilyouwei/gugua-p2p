import Database from 'nedb'
export default class DB {
    private db: Nedb
    constructor(file: string) {
        this.db = new Database({ filename: file, autoload: true })
    }
    // set an index(unique) for insert and update
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
