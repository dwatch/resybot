import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./restaurant.entity";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}

  create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = new Restaurant()
    restaurant.name = createRestaurantDto.name
    restaurant.venueId = createRestaurantDto.venueId
    //restaurant.reservations = []
    return this.restaurantRepository.save(restaurant)
  }

  findOne(uuid: string): Promise<Restaurant | null> {
    return this.restaurantRepository.findOneBy({ uuid })
  }

  async remove(uuid: string): Promise<void> {
    await this.restaurantRepository.delete(uuid)
  }
}