import { ResybotUser } from './user.entity';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<ResybotUser>;
    findOne(uuid: string): Promise<ResybotUser>;
    remove(uuid: string): Promise<void>;
}
