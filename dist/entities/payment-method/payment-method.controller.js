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
exports.PaymentMethodsController = void 0;
const common_1 = require("@nestjs/common");
const payment_method_service_1 = require("./payment-method.service");
const payment_method_dto_1 = require("./dto/payment-method.dto");
let PaymentMethodsController = class PaymentMethodsController {
    constructor(paymentMethodsService) {
        this.paymentMethodsService = paymentMethodsService;
    }
    create(createPaymentMethodDto) {
        return this.paymentMethodsService.create(createPaymentMethodDto);
    }
    findOne(uuid) {
        return this.paymentMethodsService.findOne(uuid);
    }
    remove(uuid) {
        return this.paymentMethodsService.remove(uuid);
    }
};
exports.PaymentMethodsController = PaymentMethodsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_method_dto_1.CreatePaymentMethodDto]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':uuid'),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "remove", null);
exports.PaymentMethodsController = PaymentMethodsController = __decorate([
    (0, common_1.Controller)('paymentMethods'),
    __metadata("design:paramtypes", [payment_method_service_1.PaymentMethodsService])
], PaymentMethodsController);
//# sourceMappingURL=payment-method.controller.js.map