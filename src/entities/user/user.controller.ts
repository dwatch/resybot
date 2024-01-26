import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { type ResybotUser } from './user.entity'
import { UsersService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  async create (@Body() createUserDto: CreateUserDto): Promise<ResybotUser> {
    return await this.usersService.create(createUserDto)
  }

  @Get(':uuid')
  async findOne (@Param('uuid') uuid: string): Promise<ResybotUser> {
    return await this.usersService.findOne(uuid)
  }

  @Delete(':uuid')
  async remove (@Param('uuid') uuid: string): Promise<void> {
    await this.usersService.remove(uuid)
  }
}
