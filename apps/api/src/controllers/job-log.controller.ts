import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { sendMessagePipeException, JOB_SERVICE } from '@app/shared';
import { ClientRMQ } from '@nestjs/microservices';
import { JobLogMessagePattern } from 'apps/job/src/modules/job-log/job-log.pattern';

@Controller('job-log')
export class JobLogController {
  constructor(@Inject(JOB_SERVICE) private readonly jobLogService: ClientRMQ) {}

  @Get()
  async findAll() {
    return sendMessagePipeException({
      client: this.jobLogService,
      pattern: JobLogMessagePattern.findAllJobLogs,
      data: {},
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return sendMessagePipeException({
      client: this.jobLogService,
      pattern: JobLogMessagePattern.findJobLogById,
      data: { id },
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return sendMessagePipeException({
      client: this.jobLogService,
      pattern: JobLogMessagePattern.removeJobLog,
      data: { id },
    });
  }
}
