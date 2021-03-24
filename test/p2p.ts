import smoke from 'smokesignal'
import $ from '../Util'
import fs from 'fs'
import root from 'app-root-path'
import { Network } from './Data'
import through from 'through2'
//a p2p server list
const json = `${root}/test/p2p.json`
const PORT = 6666
const stream = through(write)

function write(line, _, next) {
    // write ip list to local file
    const obj = $.parse(line.toString())
    // if object, it is ip list, set to file
    if (typeof obj == 'object') setIp(obj)
    // push to stdout in console
    else this.push(line)
    next()
}
// get ip list and transform to smoke signal required data struct
function getIp(my: Network) {
    const p2p = fs.readFileSync(json, 'utf-8')
    const list: any = $.parse(p2p)
    list[my.ip] = PORT
    const arr = []
    for (const i in list) {
        arr.push({
            address: i,
            port: list[i]
        })
    }
    return arr
}
// save ip list to local file, cover
function setIp(list: any) {
    if (!list.length) return
    const hash = $.parse(fs.readFileSync(json, 'utf-8'))
    for (const item of list) hash[item.address] = item.port
    const ipText = $.stringify(hash)
    fs.writeFileSync(json, ipText)
}
;(async () => {
    const network: Network = (await $.network()) as Network

    const list = getIp(network)
    console.log('Node List:')
    console.log(list)
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

    node.on('connect', e => {
        console.log('connected')
        console.log('Now start to type:')
        node.broadcast.write(JSON.stringify(list))
    })

    process.stdin.pipe(node.broadcast).pipe(stream).pipe(process.stdout)

    node.on('disconnect', () => {
        console.log('disconnect')
    })

    node.on('error', e => {
        console.error(e)
    })

    node.start()
})()
