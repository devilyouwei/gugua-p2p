// put all the entities here
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Index } from 'typeorm'
// block of user header
@Entity('BLOCK_USER_HEADER')
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    version: string
    @Column({ unique: true })
    preHash: string
    @Column()
    difficulty: number
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
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    pubKey: string
    @ManyToOne(() => User, user => user.registers)
    user: User
}
