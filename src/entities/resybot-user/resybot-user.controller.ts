import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { type ResybotUser } from './resybot-user.entity'
import { ResybotUserService } from './resybot-user.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')
export class ResybotUserController {
  constructor (private readonly resybotUsersService: ResybotUserService) {}

  @Post()
  async create (@Body() createUserDto: CreateUserDto): Promise<ResybotUser> {
    return await this.resybotUsersService.create(createUserDto)
  }

  @Get(':uuid')
  async findOne (@Param('uuid') uuid: string): Promise<ResybotUser> {
    return await this.resybotUsersService.findOne(uuid)
  }

  @Get('/byEmail/:email')
  async findByEmail (@Param('email') email: string): Promise<ResybotUser> {
    return await this.resybotUsersService.findOneByEmail(email)
  }

  @Delete(':uuid')
  async remove (@Param('uuid') uuid: string): Promise<void> {
    await this.resybotUsersService.remove(uuid)
  }
}
