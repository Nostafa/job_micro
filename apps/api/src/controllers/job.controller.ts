import { JOB_SERVICE, sendMessagePipeException } from '@app/shared';
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
import { ClientRMQ } from '@nestjs/microservices';
import { CreateJobDto, UpdateJobDto } from 'apps/job/src/modules/job/dto';
import { JobMessagePattern } from 'apps/job/src/modules/job/job.pattern';

@Controller('job')
export class JobController {
  constructor(@Inject(JOB_SERVICE) private readonly jobService: ClientRMQ) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    return sendMessagePipeException({
      client: this.jobService,
      pattern: JobMessagePattern.insertJob,
      data: { ...createJobDto },
    });
  }

  @Get()
  async findAll() {
    return sendMessagePipeException({
      client: this.jobService,
      pattern: JobMessagePattern.findAllJobs,
      data: {},
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return sendMessagePipeException({
      client: this.jobService,
      pattern: JobMessagePattern.findJobById,
      data: { id },
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return sendMessagePipeException({
      client: this.jobService,
      pattern: JobMessagePattern.updateJob,
      data: { id, ...updateJobDto },
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return sendMessagePipeException({
      client: this.jobService,
      pattern: JobMessagePattern.removeJob,
      data: { id },
    });
  }
}
