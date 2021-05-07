// some default config for web
export default {
    GENESIS_MSG: 'hello world', // give a genesis block message
    GENESIS_TARGET: '0x000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', // the genesis block TARGET
    TARGET_TIME: 10, // balance the time to create a new block
    TARGET_SKIP: 10, // count blocks to balance TARGET
    VERSION: '0.0.1',
    PORT: 3000,
    logging: true // console.log show or hide
}
