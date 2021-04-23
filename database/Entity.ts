// put all the entities here
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm'
import sha256 from 'sha256'
// block of user header
@Entity('BLOCK_USER_HEADER')
export class User {
    constructor(preHash: string, registers: UserRegister[] = []) {
        this.preHash = preHash // the previous block hash
        this.time = new Date().getTime()
        this.version = '1'
        this.difficulty = 1
        this.registers = registers
        this.hash = sha256(
            this.id.toString() +
                this.version +
                this.preHash +
                this.merkle +
                this.time +
                this.nonce +
                this.difficulty.toString() +
                this.registers.toString()
        )
    }
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    version: string
    @Column()
    preHash: string
    @Column()
    hash: string
    @Column()
    merkle: string
    @Column()
    time: number
    @Column()
    nonce: string
    @Column()
    difficulty: number
    // transaction info is user's public key
    @OneToMany(() => UserRegister, userRegister => userRegister.user)
    registers: UserRegister[]
}
// block of user content
@Entity('BLOCK_USER_CONTENT')
export class UserRegister {
    constructor(pubKey: string) {
        this.pubKey = pubKey
    }
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    pubKey: string
    @ManyToOne(() => User, user => user.registers)
    user: User
}
