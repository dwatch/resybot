import { v4 as uuidv4 } from 'uuid';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ResybotUser } from "../user/user.entity";
import { Restaurant } from "../restaurant/restaurant.entity";
import { ReservationStatus } from "src/models/enums/reservation-status";
import { TimesOfWeek } from "src/models/json/times-of-week";

@Entity()
export class Reservation{
  @PrimaryGeneratedColumn("uuid")
  uuid: string = uuidv4();

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date = new Date();

  @ManyToOne(() => ResybotUser, (user) => user.reservations, {onUpdate: "CASCADE", onDelete: "CASCADE"})
  user!: ResybotUser;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations)
  restaurant!: Restaurant;

  @Column()
  partySize!: number;

  @Column("text", { array: true, default: [] })
  unavailableDates!: string[];

  @Column('jsonb', { nullable: false, default: {} })
  desiredTimesOfWeek!: TimesOfWeek;

  @Column()
  status!: ReservationStatus;

  @Column({ type: "timestamptz", nullable: true})
  reservationDate?: Date | undefined = undefined;

  @Column({ type: String, nullable: true})
  reservationToken?: string | undefined = undefined;
}