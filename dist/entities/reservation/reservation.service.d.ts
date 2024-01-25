import { Reservation } from "./reservation.entity";
import { Repository } from "typeorm";
import { CreateReservationDto } from "./dto/create-reservation.dto";
export declare class ReservationsService {
    private reservationRepository;
    constructor(reservationRepository: Repository<Reservation>);
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    findOne(uuid: string): Promise<Reservation | null>;
    remove(uuid: string): Promise<void>;
}
