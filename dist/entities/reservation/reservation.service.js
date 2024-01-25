"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reservation_entity_1 = require("./reservation.entity");
const typeorm_2 = require("typeorm");
let ReservationsService = class ReservationsService {
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    create(createReservationDto) {
        const reservation = new reservation_entity_1.Reservation();
        reservation.user = createReservationDto.user;
        reservation.restaurant = createReservationDto.restaurant;
        reservation.partySize = createReservationDto.partySize;
        reservation.unavailableDates = createReservationDto.unavailableDates;
        reservation.desiredTimesOfWeek = createReservationDto.desiredTimesOfWeek;
        reservation.status = createReservationDto.status;
        reservation.reservationToken = createReservationDto.reservationToken;
        return this.reservationRepository.save(reservation);
    }
    findOne(uuid) {
        return this.reservationRepository.findOneBy({ uuid });
    }
    async remove(uuid) {
        await this.reservationRepository.delete(uuid);
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservationsService);
//# sourceMappingURL=reservation.service.js.map