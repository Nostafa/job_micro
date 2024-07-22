import { Module } from '@nestjs/common';
import { JobLogService } from './job-log.service';
import { JobLogController } from './job-log.controller';
import { JobLogHealthIndicator } from './job-log.health';
import { RabbitMQModule } from '@app/shared';

@Module({
  imports: [RabbitMQModule],
  controllers: [JobLogController],
  providers: [JobLogService, JobLogHealthIndicator],
})
export class JobLogModule {}
