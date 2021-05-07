// put all the entities here
import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne, Index } from 'typeorm'
// block of user header
@Entity('BLOCK_USER_HEADER')
export class User {
    @PrimaryColumn()
    id: number // id actually is the height of a block
    @Column()
    version: string
    @Column({ unique: true })
    preHash: string
    @Column()
    target: string // HEX string, should be transformed to bigint type
    @Column()
    nonce: number
    @Column()
    time: number
    @Column()
    merkle: string
    // transaction info is user's public key
    @OneToMany(() => UserRegister, register => register.user)
    registers: UserRegister[]
    @Column()
    @Index({ unique: true })
    hash: string
}
// block of user content
@Entity('BLOCK_USER_CONTENT')
export class UserRegister {
    @PrimaryColumn()
    pubKey: string
    @ManyToOne(() => User, user => user.registers)
    user: User
}
