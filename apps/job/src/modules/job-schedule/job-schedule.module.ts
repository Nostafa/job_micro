import { Module } from '@nestjs/common';
import { JobScheduleService } from './job-schedule.service';
import { JobScheduleController } from './job-schedule.controller';
import { JobScheduleHealthIndicator } from './job-schedule.health';
import { RabbitMQModule } from '@app/shared';

@Module({
  imports: [RabbitMQModule],
  controllers: [JobScheduleController],
  providers: [JobScheduleService, JobScheduleHealthIndicator],
})
export class JobScheduleModule {}
