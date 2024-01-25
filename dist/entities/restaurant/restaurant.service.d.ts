import { Restaurant } from "./restaurant.entity";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
export declare class RestaurantsService {
    private restaurantRepository;
    constructor(restaurantRepository: Repository<Restaurant>);
    create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant>;
    findOne(uuid: string): Promise<Restaurant | null>;
    remove(uuid: string): Promise<void>;
}
