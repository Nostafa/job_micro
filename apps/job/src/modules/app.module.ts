import { Module } from '@nestjs/common';
import { JobModule } from './job/job.module';
import { JobScheduleModule } from './job-schedule/job-schedule.module';
import { JobLogModule } from './job-log/job-log.module';

@Module({ imports: [JobModule, JobScheduleModule, JobLogModule] })
export class AppModule {}
