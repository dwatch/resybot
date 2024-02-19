import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Restaurant } from './restaurant.entity'
import { Repository } from 'typeorm'
import { type CreateRestaurantDto } from './dto/create-restaurant.dto'

@Injectable()
export class RestaurantsService {
  constructor (
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>
  ) {}

  async create (createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = new Restaurant()
    restaurant.name = createRestaurantDto.name
    restaurant.venueId = createRestaurantDto.venueId
    return await this.save(restaurant)
  }

  async incrementPendingCount(restaurant: Restaurant, count: number) {
    restaurant.pendingReservationCount += count
    await this.save(restaurant)
  }

  async decrementPendingCount(restaurant: Restaurant, count: number) {
    restaurant.pendingReservationCount -= count
    await this.save(restaurant)
  }

  async save(restaurant: Restaurant): Promise<Restaurant> {
    return await this.restaurantRepository.save(restaurant)
  }

  async findOne (uuid: string): Promise<Restaurant | null> {
    return await this.restaurantRepository.findOneBy({ uuid })
  }

  async findOneByVenueId (venueId: string): Promise<Restaurant | null> {
    return await this.restaurantRepository.findOneBy({ venueId: venueId })
  }

  async findAllWithPendingReservations (): Promise<Restaurant[]> {
    return await this.restaurantRepository.createQueryBuilder('restaurant')
      .where('restaurant.pendingReservationCount > 0').getMany()
  }

  async remove (uuid: string): Promise<void> {
    await this.restaurantRepository.delete(uuid)
  }
}
