import smoke from 'smokesignal'
import $ from '../Util'
import fs from 'fs'
import root from 'app-root-path'
import { Network } from './Data'
import through from 'through2'
const stream = through(write, end)
//a p2p server list
const json = `${root}/test/p2p.json`
function write(line, _, next) {
    console.log(line.toString())
    setIp(JSON.parse(line.toString()))
    next()
}
function end(done) {
    done()
}

function getIp() {
    const p2p = fs.readFileSync(json, 'utf-8')
    const list: any = JSON.parse(p2p)
    const arr = []
    for (const i in list) {
        arr.push({
            address: i,
            port: list[i]
        })
    }
    return arr
}
function setIp(list: any[]) {
    const hash = {}
    for (const item of list) {
        hash[item] = item.port
    }
    const ipText = JSON.stringify(hash)
    fs.writeFileSync(json, JSON.stringify(hash))
}
;(async () => {
    const PORT = 6666
    const network: Network = (await $.network()) as Network

    const list = getIp()
    // get user network
    const node = smoke.createNode({
        port: PORT,
        address: smoke.localIp(`${network.ip}/${network.netmask}`),
        seeds: list
    })

    console.log('Port', node.options.port)
    console.log('IP', node.options.address)
    console.log('ID', node.id)

    console.log('Connecting...')

    node.on('connect', () => {
        console.log('connected')
        node.broadcast.write(JSON.stringify(list))
    })

    node.on('disconnect', () => {
        console.log('disconnect')
    })

    // Send message
    process.stdin.pipe(node.broadcast).pipe(stream)

    node.on('error', e => {
        console.error(e)
    })
    node.broadcast
    node.start()
})()
