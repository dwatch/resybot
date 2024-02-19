import { Body, Controller, Get } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CheckForNewDayDto } from './dto/checkForNewDay.dto';
import { BookFirstAvailableSlotDto } from './dto/bookFirstAvailableSlot.dto';

@Controller('worker')
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService
  ) {}

  @Get('checkForNewDay')
  async triggerCheckForNewDay (@Body() body: CheckForNewDayDto) {
    return await this.workerService.triggerCheckForNewDay(body)
  }

  @Get('bookFirstAvailableSlot')
  async triggerBookFirstAvailableSlot(@Body() body: BookFirstAvailableSlotDto) {
    return await this.workerService.triggerBookFirstAvailableSlot(body)
  }
}
