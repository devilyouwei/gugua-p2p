import express from 'express'

const app = express()
app.all('*', async (req, res, next) => {
    try {
        if (req.method === 'POST') req.body = req.query
        const path = req.path
        const ctl = path.split('/')[1] || 'Index'
        const act = path.split('/')[2] || 'index'
        const controller = await import(`./controller/${ctl}`)
        controller[ctl][act](req, res)
    } catch (e) {
        return next(e)
    }
})
app.listen(3000)
