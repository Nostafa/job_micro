import { IsString, IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateJobScheduleDto {
  @IsUUID()
  readonly jobId: string;

  @IsString()
  @IsNotEmpty()
  readonly cronExpression: string;

  @IsDateString()
  readonly startTime: Date;

  @IsDateString()
  readonly endTime: Date;
}
