import { RestaurantsService } from "./restaurant.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Restaurant } from "./restaurant.entity";
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant>;
    findOne(uuid: string): Promise<Restaurant>;
    remove(uuid: string): Promise<void>;
}
