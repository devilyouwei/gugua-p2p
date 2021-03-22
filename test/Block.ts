import md5 from 'md5'
class Block {
    user: string
    msg: string
    time: number
    hash: string
    pHash: string
    constructor(user: string, msg: string, hash: string) {
        this.user = user
        this.msg = msg
        this.pHash = hash
        this.time = new Date().getTime()
        this.hash = md5(this.pHash + this.msg + this.time.toString())
    }
    check() {
        return this.hash === md5(this.pHash + this.msg + this.time)
    }
    show() {
        console.log(this)
    }
}
export default Block
