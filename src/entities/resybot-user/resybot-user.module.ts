import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResybotUserService } from './resybot-user.service'
import { ResybotUser } from './resybot-user.entity'
import { ResybotUserController } from './resybot-user.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ResybotUser])],
  providers: [ResybotUserService],
  controllers: [ResybotUserController],
  exports: [ResybotUserService]
})
export class ResybotUserModule {}
