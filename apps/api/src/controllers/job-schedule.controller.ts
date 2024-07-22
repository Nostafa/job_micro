import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { JOB_SERVICE, sendMessagePipeException } from '@app/shared';
import { ClientRMQ } from '@nestjs/microservices';
import {
  CreateJobScheduleDto,
  UpdateJobScheduleDto,
} from 'apps/job/src/modules/job-schedule/dto';
import { JobScheduleMessagePattern } from 'apps/job/src/modules/job-schedule/job-schedule.pattern';

@Controller('job-schedule')
export class JobScheduleController {
  constructor(
    @Inject(JOB_SERVICE)
    private readonly jobScheduleService: ClientRMQ,
  ) {}

  @Post()
  async create(@Body() createJobScheduleDto: CreateJobScheduleDto) {
    return sendMessagePipeException({
      client: this.jobScheduleService,
      pattern: JobScheduleMessagePattern.insertJobSchedule,
      data: { ...createJobScheduleDto },
    });
  }

  @Get()
  async findAll() {
    return sendMessagePipeException({
      client: this.jobScheduleService,
      pattern: JobScheduleMessagePattern.findAllJobsSchedule,
      data: {},
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return sendMessagePipeException({
      client: this.jobScheduleService,
      pattern: JobScheduleMessagePattern.findJobScheduleById,
      data: { id },
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJobScheduleDto: UpdateJobScheduleDto,
  ) {
    return sendMessagePipeException({
      client: this.jobScheduleService,
      pattern: JobScheduleMessagePattern.updateJobSchedule,
      data: { id, ...updateJobScheduleDto },
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return sendMessagePipeException({
      client: this.jobScheduleService,
      pattern: JobScheduleMessagePattern.removeJobSchedule,
      data: { id },
    });
  }
}
