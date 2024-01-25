import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResybotUser } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(ResybotUser)
    private usersRepository: Repository<ResybotUser>
  ) {}

  create(createUserDto: CreateUserDto): Promise<ResybotUser> {
    const user = new ResybotUser()
    user.email = createUserDto.email
    user.password = createUserDto.password
    user.firstName = createUserDto.firstName
    user.lastName = createUserDto.lastName
    user.authToken = createUserDto.authToken
    user.paymentMethods = []
    user.reservations = []
    return this.usersRepository.save(user)
    }

  findOne(uuid: string): Promise<ResybotUser | null> {
    return this.usersRepository.findOneBy({ uuid: uuid })
  }

  async remove(uuid: string): Promise<void> {
    await this.usersRepository.delete(uuid)
  }
}