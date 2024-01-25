import { Repository } from 'typeorm';
import { ResybotUser } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<ResybotUser>);
    create(createUserDto: CreateUserDto): Promise<ResybotUser>;
    findOne(uuid: string): Promise<ResybotUser | null>;
    remove(uuid: string): Promise<void>;
}
