import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CheckForNewDayDto } from './dto/checkForNewDay.dto';
import { BookFirstAvailableSlotDto } from './dto/bookFirstAvailableSlot.dto';

@Injectable()
export class WorkerService {
  constructor(
    @InjectQueue('checkForNewDay') private checkForNewDayWorker: Queue,
    @InjectQueue('bookFirstAvailableSlot') private bookFirstAvailableSlotWorker: Queue
  ) {}

  async triggerCheckForNewDay(data: CheckForNewDayDto) {
    await this.checkForNewDayWorker.add('search', data)
  }

  async triggerBookFirstAvailableSlot(data: BookFirstAvailableSlotDto) {
    await this.bookFirstAvailableSlotWorker.add('run', data)
  }
}