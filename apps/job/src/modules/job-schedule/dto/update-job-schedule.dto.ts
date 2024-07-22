import { PartialType } from '@nestjs/mapped-types';
import { CreateJobScheduleDto } from './create-job-schedule.dto';

export class UpdateJobScheduleDto extends PartialType(CreateJobScheduleDto) {}
