import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CheckForNewDayDto } from '../dto/checkForNewDay.dto';
import { ResyClient } from 'src/resy/resy.client';

@Processor('checkForNewDay')
export class CheckForNewDayWorker {
  constructor(
    private readonly resyClient: ResyClient
  ) {}

  private readonly logger = new Logger(CheckForNewDayWorker.name);

  @Process('search')
  async search(job: Job) {
    const data: CheckForNewDayDto = job.data
    const venueId = data.venueId
    console.log(venueId)
  }
}