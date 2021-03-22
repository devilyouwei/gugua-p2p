import Block from './Block'
class Chain {
    block: Block[] = []
    constructor(block: Block[] = []) {
        // transform json object to Block object
        for (const item of block) this.add(item.user, item.msg)
    }
    check() {
        let i = 0
        while (this.block[i]) {
            // block check error
            if (!this.block[i].check()) {
                throw new Error(`block error: ${i}`)
            }
            // chain check error
            if (this.block[i].pHash !== (this.block[i - 1]?.hash || 'first block')) {
                throw new Error(`block error: ${i - 1} and ${i}`)
            }
            i++
        }
        return true
    }
    add(user: string, msg: string) {
        const post = new Block(user, msg, this.block[this.block.length - 1]?.hash || 'first block')
        this.block.push(post)
    }
    get(i: number) {
        return this.block[i]
    }
    list() {
        return this.block
    }
}
export default Chain
