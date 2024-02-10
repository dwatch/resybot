import { Body, Controller, Get } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CheckForNewDayDto } from './dto/checkForNewDay.dto';

@Controller('worker')
export class WorkerController {
  constructor(
    private readonly workerService: WorkerService
  ) {}

  @Get('test')
  async test (@Body() body: CheckForNewDayDto) {
    return await this.workerService.triggerCheckForNewDayDto(body)
  }
}
