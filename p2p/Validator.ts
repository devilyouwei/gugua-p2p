// To check the messages between peers
import ZSchema from 'z-schema'
const schema = {
    heart: {
        id: 'heart',
        type: 'object',
        properties: {
            status: { type: 'number' },
            msg: { type: 'string' },
            data: [{ $ref: 'Peer' }]
        },
        required: ['status', 'msg', 'data']
    },
    peer: {
        id: 'Peer',
        type: 'object',
        properties: {
            id: 'string',
            address: 'string',
            token: 'string',
            time: 'number',
            alive: 'number'
        },
        required: ['id', 'address', 'token', 'time', 'alive']
    }
}
export class Validator {
    private validator: ZSchema
    constructor(option: ZSchema.Options = {}) {
        this.validator = new ZSchema(option)
        this.validator.validateSchema(schema)
    }
    validHeart(data: any): boolean {
        return this.validator.validate(data, schema['heart'])
    }
}
