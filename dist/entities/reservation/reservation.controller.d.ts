import { ReservationsService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Reservation } from "./reservation.entity";
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    findOne(uuid: string): Promise<Reservation | null>;
    remove(uuid: string): Promise<void>;
}
