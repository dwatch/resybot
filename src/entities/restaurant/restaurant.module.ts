import { Module } from '@nestjs/common'
import { RestaurantsController } from './restaurant.controller'
import { RestaurantsService } from './restaurant.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Restaurant } from './restaurant.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestaurantsService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService]
})
export class RestaurantsModule {}
