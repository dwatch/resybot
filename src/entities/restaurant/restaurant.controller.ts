import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { RestaurantsService } from "./restaurant.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Restaurant } from "./restaurant.entity";

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantsService.create(createRestaurantDto)
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<Restaurant> {
    return this.restaurantsService.findOne(uuid)
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.restaurantsService.remove(uuid)
  }
}