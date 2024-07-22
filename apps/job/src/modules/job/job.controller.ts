import { JobHealthIndicator } from './job.health';
import { Controller } from '@nestjs/common';
import { JobService } from './job.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitMQService } from '@app/shared';
import { JobMessagePattern } from './job.pattern';
import { CreateJobDto } from './dto';
import { Job } from '@prisma/client';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller()
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly rabbitMqService: RabbitMQService,
    private readonly jobHealthIndicator: JobHealthIndicator,
  ) {}

  @MessagePattern(JobMessagePattern.isHealthy)
  async isHealthy(
    @Ctx() context: RmqContext,
    @Payload() { key }: { key: string },
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobHealthIndicator.isHealthy(key);
  }

  @MessagePattern(JobMessagePattern.insertJob)
  async create(
    @Ctx() context: RmqContext,
    @Payload() createJobDto: CreateJobDto,
  ): Promise<Job> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobService.create(createJobDto);
  }

  @MessagePattern(JobMessagePattern.findAllJobs)
  async findAll(@Ctx() context: RmqContext): Promise<Job[]> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobService.findAll();
  }

  @MessagePattern(JobMessagePattern.findJobById)
  async findOne(
    @Ctx() context: RmqContext,
    @Payload('id') id: string,
  ): Promise<Job> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobService.findOne(id);
  }

  @MessagePattern(JobMessagePattern.updateJob)
  async update(
    @Ctx() context: RmqContext,
    @Payload() updateJobDto: UpdateJobDto & { id: string },
  ): Promise<Job> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobService.update(updateJobDto.id, updateJobDto);
  }

  @MessagePattern(JobMessagePattern.removeJob)
  async remove(
    @Ctx() context: RmqContext,
    @Payload('id') id: string,
  ): Promise<Job> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobService.remove(id);
  }
}
