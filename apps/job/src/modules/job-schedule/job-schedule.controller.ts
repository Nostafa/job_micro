import { Controller } from '@nestjs/common';
import { JobScheduleService } from './job-schedule.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitMQService } from '@app/shared';
import { JobScheduleMessagePattern } from './job-schedule.pattern';
import { CreateJobScheduleDto } from './dto/create-job-schedule.dto';
import { JobSchedule } from '@prisma/client';
import { UpdateJobScheduleDto } from './dto/update-job-schedule.dto';
import { JobScheduleHealthIndicator } from './job-schedule.health';

@Controller()
export class JobScheduleController {
  constructor(
    private readonly jobScheduleService: JobScheduleService,
    private readonly rabbitMqService: RabbitMQService,
    private readonly jobScheduleHealthIndicator: JobScheduleHealthIndicator,
  ) {}

  @MessagePattern(JobScheduleMessagePattern.isHealthy)
  async isHealthy(
    @Ctx() context: RmqContext,
    @Payload() { key }: { key: string },
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobScheduleHealthIndicator.isHealthy(key);
  }

  @MessagePattern(JobScheduleMessagePattern.insertJobSchedule)
  async create(
    @Ctx() context: RmqContext,
    @Payload() createJobScheduleDto: CreateJobScheduleDto,
  ): Promise<JobSchedule> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobScheduleService.create(createJobScheduleDto);
  }

  @MessagePattern(JobScheduleMessagePattern.findAllJobsSchedule)
  async findAll(@Ctx() context: RmqContext): Promise<JobSchedule[]> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobScheduleService.findAll();
  }

  @MessagePattern(JobScheduleMessagePattern.findJobScheduleById)
  async findOne(
    @Ctx() context: RmqContext,
    @Payload('id') id: string,
  ): Promise<JobSchedule> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobScheduleService.findOne(id);
  }

  @MessagePattern(JobScheduleMessagePattern.updateJobSchedule)
  async update(
    @Ctx() context: RmqContext,
    @Payload() updateJobScheduleDto: UpdateJobScheduleDto & { id: string },
  ): Promise<JobSchedule> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobScheduleService.update(
      updateJobScheduleDto.id,
      updateJobScheduleDto,
    );
  }

  @MessagePattern(JobScheduleMessagePattern.removeJobSchedule)
  async remove(
    @Ctx() context: RmqContext,
    @Payload('id') id: string,
  ): Promise<JobSchedule> {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.jobScheduleService.remove(id);
  }
}
