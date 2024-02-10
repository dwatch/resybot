import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CheckForNewDayWorker } from './workers/checkForNewDay.worker';
import { WorkerService } from './worker.service';
import { ResyModule } from 'src/resy/resy.module';
import { WorkerController } from './worker.controller';
import { UtilityModule } from 'src/utilities/utility.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'checkForNewDay' }),
    ResyModule,
    UtilityModule
  ],
  providers: [
    WorkerService,
    CheckForNewDayWorker
  ],
  exports: [
    WorkerService
  ],
  controllers: [WorkerController]
})
export class WorkerModule {}
