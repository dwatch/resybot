import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { RestaurantsService } from './restaurant.service'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { type Restaurant } from './restaurant.entity'

@Controller('restaurants')
export class RestaurantsController {
  constructor (private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async create (@Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return await this.restaurantsService.create(createRestaurantDto)
  }

  @Get(':uuid')
  async findOne (@Param('uuid') uuid: string): Promise<Restaurant> {
    return await this.restaurantsService.findOne(uuid)
  }

  @Delete(':uuid')
  async remove (@Param('uuid') uuid: string): Promise<void> {
    await this.restaurantsService.remove(uuid)
  }
}
