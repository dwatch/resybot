import { v4 as uuidv4 } from 'uuid'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Reservation } from '../reservation/reservation.entity'

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
    uuid: string = uuidv4()

  @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date = new Date()

  @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date = new Date()

  @Column()
    name!: string

  @Column()
    venueId!: string

  @OneToMany(() => Reservation, (reservation) => reservation.restaurant)
    reservations!: Reservation[]

  @Column({ default: 0 })
    pendingReservationCount: number = 0

  @Column({ nullable: true })
    newReservationReleaseTime: string | undefined = undefined

  @Column({ nullable: true })
    lastCheckedDate: string | undefined = undefined
}
