import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CheckForNewDayDto } from './dto/checkForNewDay.dto';

@Injectable()
export class WorkerService {
  constructor(
    @InjectQueue('checkForNewDay') private checkForNewDayQueue: Queue
  ) {}

  async triggerCheckForNewDayDto(data: CheckForNewDayDto) {
    await this.checkForNewDayQueue.add('search', data)
  }
}