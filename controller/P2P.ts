import { Request, Response } from 'express'
import crpt from 'libp2p-crypto'
import PeerId from 'peer-id'
export class P2P {
    static async startP2P(req: Request, res: Response): Promise<void> {
        const privKey = req.body.privKey.toString()
        const password = req.body.password.toString()
        const rpk = await crpt.keys.import(privKey, password)
        const peerid = await PeerId.createFromPrivKey(rpk.bytes)
        console.log(peerid.toJSON())
    }
}
