import { v4 as uuidv4 } from 'uuid'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ResybotUser } from '../resybot-user/resybot-user.entity'

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
    uuid: string = uuidv4()

  @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date = new Date()

  @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date = new Date()

  @ManyToOne(() => ResybotUser, (user) => user.paymentMethods, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    user!: ResybotUser

  @Column()
    isDefault!: boolean

  @Column()
    lastFourDigits!: string

  @Column()
    expiryMonth!: number

  @Column()
    expiryYear!: number

  @Column()
    resyId!: string
}
