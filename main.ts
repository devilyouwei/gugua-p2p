import express from 'express'
import root from 'app-root-path'
import { config } from './config/web.config'

const app = express()
app.all('*', async (req, res, next) => {
    try {
        if (req.method === 'GET') req.body = req.query
        const path = req.path
        const ctl = path.split('/')[1] || 'Index'
        if (path.includes('.')) return res.sendFile(`${root}/static/${ctl}`) // send static files
        const act = path.split('/')[2] || 'index'
        const controller = await import(`${root}/controller/${ctl}`)
        controller[ctl][act](req, res)
    } catch (e) {
        return next(e)
    }
})
app.listen(config.PORT)
