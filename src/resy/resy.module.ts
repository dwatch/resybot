import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ResyClient } from './resy.client'
import { ResyController } from './resy.controller'
import { ResyPresenter } from './resy.presenter'

@Module({
  imports: [HttpModule],
  providers: [ResyClient, ResyPresenter],
  controllers: [ResyController],
  exports: [ResyClient]
})
export class ResyModule {}
