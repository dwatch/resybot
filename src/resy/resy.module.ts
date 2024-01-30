import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ResyClient } from './resy.client'
import { ResyController } from './resy.controller'
import { ResyPresenter } from './resy.presenter'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Module({
  imports: [HttpModule],
  providers: [
    ResyClient, 
    ResyPresenter, 
    {provide: APP_GUARD, useClass: JwtAuthGuard}
  ],
  controllers: [ResyController],
  exports: [ResyClient]
})
export class ResyModule {}
