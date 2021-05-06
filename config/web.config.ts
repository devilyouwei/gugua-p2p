// some default config for web
export default {
    GENESIS_MSG: 'hello world', // the genesis block message
    GENESIS_DIFFICAULTY: '0x00000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', // the genesis block difficulty
    DIFFICAULTY_TIME: 120, // balance the time to create a new block
    DIFFICAULTY_SKIP: 10, // count blocks to balance difficulty
    VERSION: '0.0.1',
    PORT: 3000,
    logging: true // console.log show or hide
}
