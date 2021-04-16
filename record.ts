import Chain from './blockchain/Chain'
import Block from './blockchain/Block'
import fs from 'fs'
import readline from 'readline'
import root from 'app-root-path'
const json = `${root}/test/record.json`

try {
    const record = fs.readFileSync(json, 'utf-8')
    const arr = JSON.parse(record) as Block[]
    const chain = new Chain(arr)
    chain.check()
    let user = ''
    let message = ''
    const r = readline.createInterface({ input: process.stdin, output: process.stdout })
    console.log('Input username and message (use enter to separate two), input (ctrl-C) to cancel record')
    r.on('line', input => {
        if (!user) return (user = input)
        message = input
        r.close()
        chain.add(user, message)
        chain.check()
        const list = chain.list()
        fs.writeFileSync(json, JSON.stringify(list))
        console.log('success to add a record!')
        for (const item of list) {
            const realtime = new Date(item.time)
            console.log(`${realtime} ${item.user} ${item.msg}`)
        }
    })
} catch (e) {
    console.error(e)
}
