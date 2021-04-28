// The main entrance, start an http server
// all the data exchange should use formData datatype through POST method
import express from 'express'
import root from 'app-root-path'
import os from 'os'
import config from './config/web.config'
import formData from 'express-form-data'
import Block from './blockchain/Block'
async function test() {
    while (true) {
        // get latest block
        const latestBlock = await Block.latestBlock()

        const nonce = await Block.mine(latestBlock)

        // verify nonce
        let verifyNonce = true
        if (latestBlock) verifyNonce = Block.checkNonce(nonce, latestBlock)
        if (!verifyNonce) throw new Error('Check nonce invalid')

        // add a new block
        const newBlock = await Block.add(latestBlock, nonce, [])

        // verify Hash
        let verifyHash = true
        if (latestBlock) verifyHash = Block.checkHash(newBlock, latestBlock)
        if (!verifyHash) throw new Error('Check hash invalid')
    }
}
test()
const app = express()
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
}
app.use(formData.parse(options))
app.use(formData.format())
app.use(formData.stream())
app.use(formData.union())
// map router as format path:port/controller/action/
app.all('*', async (req, res, next) => {
    try {
        if (req.method === 'GET') req.body = req.query // trans GET to POST
        const path = req.path
        const ctl = path.split('/')[1] || 'Index'
        if (path.includes('.')) return res.sendFile(`${root}/static/${ctl}`) // send static files
        const act = path.split('/')[2] || 'index'
        const controller = await import(`${root}/controller/${ctl}`)
        controller[ctl][act](req, res)
    } catch (e) {
        next(e)
    }
})
app.listen(config.PORT)
