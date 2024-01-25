"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./entities/user/user.module");
const payment_method_module_1 = require("./entities/payment-method/payment-method.module");
const restaurant_module_1 = require("./entities/restaurant/restaurant.module");
const reservation_module_1 = require("./entities/reservation/reservation.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: '127.0.0.1',
                port: 5432,
                username: 'resybot_admin',
                password: 'resybot1Password2',
                database: 'resybot',
                entities: [],
                autoLoadEntities: true,
                synchronize: false,
            }),
            user_module_1.UsersModule,
            payment_method_module_1.PaymentMethodsModule,
            restaurant_module_1.RestaurantsModule,
            reservation_module_1.ReservationsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map