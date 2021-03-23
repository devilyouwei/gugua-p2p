import smoke from 'smokesignal'

const node = smoke.createNode({
    port: 6666,
    address: smoke.localIp('192.168.2.150/255.255.255.0'),
    seeds: [{ port: 6666, address: '192.168.2.149' }]
})

console.log('Port', node.options.port)
console.log('IP', node.options.address)
console.log('ID', node.id)

console.log('Connecting...')

node.on('connect', () => {
    console.log('connected')
})
node.on('disconnect', () => {
    console.log('disconnect')
})
// Send message
process.stdin.pipe(node.broadcast).pipe(process.stdout)
node.on('error', e => {
    console.error(e)
})
node.start()

console.log(node)
