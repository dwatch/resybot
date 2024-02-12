import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ResyClient } from 'src/resy/resy.client';
import { BookFirstAvailableSlotDto } from '../dto/bookFirstAvailableSlot.dto';

@Processor('bookFirstAvailableSlot')
export class BookFirstAvailableSlotWorker {
  constructor(
    private readonly resyClient: ResyClient
  ) {}
  
  private readonly logger = new Logger(BookFirstAvailableSlotWorker.name);

  @Process({name:'run', concurrency: 10})
  async run(job: Job) {
    // Pull up the new day
    const data: BookFirstAvailableSlotDto = job.data
    console.log(data)
    // See if that fits the user's needs
    // See if there are fitting times
    // Iterate through and try booking until one completes or runs out
  }
}