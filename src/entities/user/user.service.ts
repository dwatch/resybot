import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResybotUser } from './user.entity'
import { type CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(ResybotUser)
    private readonly usersRepository: Repository<ResybotUser>
  ) {}

  async create (createUserDto: CreateUserDto): Promise<ResybotUser> {
    const user = new ResybotUser()
    user.email = createUserDto.email
    user.password = createUserDto.password
    user.firstName = createUserDto.firstName
    user.lastName = createUserDto.lastName
    user.authToken = createUserDto.authToken
    user.paymentMethods = []
    user.reservations = []
    return await this.usersRepository.save(user)
  }

  async findOne (uuid: string): Promise<ResybotUser | null> {
    return await this.usersRepository.findOneBy({ uuid })
  }

  async remove (uuid: string): Promise<void> {
    await this.usersRepository.delete(uuid)
  }
}
