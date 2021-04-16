import { Request, Response } from 'express'
export class Index {
    static index(req: Request, res: Response) {
        res.end(`
                <h1 style="text-align:center;padding-top:10%;">Welcome to GuGua!</h1>
                <p>Your IP:${req.ip}</p>
                <p>Your Params:${req.body}</p>
                `)
    }
}
