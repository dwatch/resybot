import { v4 as uuidv4 } from 'uuid'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ResybotUser } from '../resybot-user/resybot-user.entity'
import { Restaurant } from '../restaurant/restaurant.entity'
import { TimesOfWeek } from 'src/utilities/json/times-of-week'
//import { ReservationStatus } from 'src/utilities/enums/reservation-status'

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
    uuid: string = uuidv4()

  @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date = new Date()

  @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date = new Date()

  @ManyToOne(() => ResybotUser, (user) => user.reservations, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    user!: ResybotUser

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations)
    restaurant!: Restaurant

  @Column()
    partySize!: number

  @Column('text', { array: true, default: [] })
    unavailableDates!: string[]

  @Column('jsonb', { nullable: false, default: {} })
    desiredTimesOfWeek!: TimesOfWeek

  @Column()
    status!: ReservationStatus

  @Column()
    reservationDay: String | undefined = undefined

  @Column()
    reservationTime: String | undefined = undefined

  @Column({ type: String, nullable: true })
    reservationToken?: string | undefined = undefined
}

export enum ReservationStatus {
  PENDING = 'pending',
  BOOKED = 'booked',
  CANCELED = 'canceled',
  PASSED = 'passed'
}
