import { v4 as uuidv4 } from 'uuid';
import { Entity, Column, OneToMany, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentMethod } from '../payment-method/payment-method.entity';
import { Reservation } from '../reservation/reservation.entity';

@Entity()
export class ResybotUser {
  @PrimaryGeneratedColumn("uuid")
  uuid: string = uuidv4();

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date = new Date();

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  authToken!: string;

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  paymentMethods!: PaymentMethod[];

  @Column({ default: 0 })
  pendingReservationCount: number = 0;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations!: Reservation[];
}