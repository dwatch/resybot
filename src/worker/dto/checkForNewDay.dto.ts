import { Restaurant } from "src/entities/restaurant/restaurant.entity"

export class CheckForNewDayDto {
  restaurant: Restaurant
  startDate: string
  endDate: string
}