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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResybotUser = void 0;
const uuid_1 = require("uuid");
const typeorm_1 = require("typeorm");
const payment_method_entity_1 = require("../payment-method/payment-method.entity");
const reservation_entity_1 = require("../reservation/reservation.entity");
let ResybotUser = class ResybotUser {
    constructor() {
        this.uuid = (0, uuid_1.v4)();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.pendingReservationCount = 0;
    }
};
exports.ResybotUser = ResybotUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ResybotUser.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ResybotUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ResybotUser.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResybotUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResybotUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResybotUser.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResybotUser.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ResybotUser.prototype, "authToken", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_method_entity_1.PaymentMethod, (paymentMethod) => paymentMethod.user),
    __metadata("design:type", Array)
], ResybotUser.prototype, "paymentMethods", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ResybotUser.prototype, "pendingReservationCount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.user),
    __metadata("design:type", Array)
], ResybotUser.prototype, "reservations", void 0);
exports.ResybotUser = ResybotUser = __decorate([
    (0, typeorm_1.Entity)()
], ResybotUser);
//# sourceMappingURL=user.entity.js.map