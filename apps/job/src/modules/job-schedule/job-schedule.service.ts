import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '@app/shared';
import { CreateJobScheduleDto, UpdateJobScheduleDto } from './dto';
import { JobSchedule } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JobScheduleService {
  constructor(private readonly database: DatabaseService) {}

  // Create a new job schedule
  async create(
    createJobScheduleDto: CreateJobScheduleDto,
  ): Promise<JobSchedule> {
    const { jobId } = createJobScheduleDto;
    try {
      await this.checkJobId(jobId);
      return await this.database.jobSchedule.create({
        data: createJobScheduleDto,
      });
    } catch (error) {
      throw new RpcException(
        new BadRequestException('Failed to create job schedule'),
      );
    }
  }

  // Find all job schedules
  async findAll(): Promise<JobSchedule[]> {
    return this.database.jobSchedule.findMany();
  }

  // Find a job schedule by ID
  async findOne(id: string): Promise<JobSchedule | null> {
    const jobSchedule = await this.database.jobSchedule.findUnique({
      where: { id },
    });
    if (!jobSchedule) {
      throw new RpcException(
        new NotFoundException(`JobSchedule with ID ${id} not found`),
      );
    }
    return jobSchedule;
  }

  // Update a job schedule
  async update(
    id: string,
    updateJobScheduleDto: UpdateJobScheduleDto,
  ): Promise<JobSchedule> {
    try {
      const { jobId } = updateJobScheduleDto;
      if (jobId) await this.checkJobId(jobId);
      const jobSchedule = await this.database.jobSchedule.findUnique({
        where: { id },
      });

      if (!jobSchedule) {
        throw new RpcException(
          new NotFoundException(`JobSchedule with ID ${id} not found`),
        );
      }

      return await this.database.jobSchedule.update({
        where: { id },
        data: updateJobScheduleDto,
      });
    } catch (error) {
      throw new RpcException(
        new BadRequestException('Failed to update job schedule'),
      );
    }
  }

  // Delete a job schedule
  async remove(id: string): Promise<JobSchedule> {
    try {
      const jobSchedule = await this.database.jobSchedule.findUnique({
        where: { id },
      });

      if (!jobSchedule) {
        throw new RpcException(
          new NotFoundException(`JobSchedule with ID ${id} not found`),
        );
      }

      return await this.database.jobSchedule.delete({
        where: { id },
      });
    } catch (error) {
      throw new RpcException(
        new BadRequestException('Failed to delete job schedule'),
      );
    }
  }

  private async checkJobId(jobId) {
    const findJob = await this.database.job.findUnique({
      where: { id: jobId },
    });
    if (!findJob)
      throw new RpcException(
        new NotFoundException(`Job with ID ${jobId} not found`),
      );
  }
}
