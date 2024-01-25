import { Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import { ResybotUser } from './user.entity';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<ResybotUser> {
    return this.usersService.create(createUserDto)
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string): Promise<ResybotUser> {
    return this.usersService.findOne(uuid)
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string): Promise<void> {
    return this.usersService.remove(uuid)
  }
}