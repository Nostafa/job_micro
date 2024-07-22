import { Controller } from '@nestjs/common';
import { JobLogService } from './job-log.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitMQService } from '@app/shared';
import { JobLogMessagePattern } from './job-log.pattern';
import { JobLog } from '@prisma/client';
import { JobLogHealthIndicator } from './job-log.health';

@Controller()
export class JobLogController {
  constructor(
    private readonly jobLogService: JobLogService,
    private readonly rabbitMqService: RabbitMQService,
    private readonly jobLogHealthIndicator: JobLogHealthIndicator,
  ) {}

  @MessagePattern(JobLogMessagePattern.isHealthy)
  async isHealthy(
    @Ctx() context: RmqContext,
    @Payload() { key }: { key: string },
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobLogHealthIndicator.isHealthy(key);
  }

  @MessagePattern(JobLogMessagePattern.findAllJobLogs)
  async findAll(@Ctx() context: RmqContext): Promise<JobLog[]> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobLogService.findAll();
  }

  @MessagePattern(JobLogMessagePattern.findJobLogById)
  async findOne(
    @Ctx() context: RmqContext,
    @Payload('id') id: string,
  ): Promise<JobLog> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobLogService.findOne(id);
  }

  @MessagePattern(JobLogMessagePattern.removeJobLog)
  async remove(
    @Ctx() context: RmqContext,
    @Payload('id') id: string,
  ): Promise<JobLog> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobLogService.remove(id);
  }
}
