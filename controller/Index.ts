import { Request, Response } from 'express'
export class Index {
    static index(_: Request, res: Response): void {
        res.end(`<h1 style="text-align:center;padding-top:30vh;">Welcome to GuGua!</h1>`)
    }
}
