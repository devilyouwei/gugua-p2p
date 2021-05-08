// This is config for genesis blocks
// MSG: a message for genesis block
// TARGET: indicate the difficulty
// TIME: time to create a new block
// INTERVAL: count of blocks to set a new target
// VERSION: the version of blockchain
export default {
    VERSION: '0.0.1',
    BLOCK_USER: {
        MSG: 'hello world',
        TARGET: '0x000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
        TIME: 10,
        INTERVAL: 10
    }
}
