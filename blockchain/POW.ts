import Block from './Block'
export default class ProofOfWork {
    block: Block
    target: number
    constructor(block: Block) {
        this.block = block
    }
}
