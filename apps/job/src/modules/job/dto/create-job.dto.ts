import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsUUID()
  readonly userId: string;
}
