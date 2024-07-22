import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '@app/shared';
import { JobLog } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JobLogService {
  constructor(private readonly database: DatabaseService) {}

  // Find all job logs
  async findAll(): Promise<JobLog[]> {
    return this.database.jobLog.findMany();
  }

  // Find a job log by ID
  async findOne(id: string): Promise<JobLog | null> {
    const jobLog = await this.database.jobLog.findUnique({
      where: { id },
    });
    if (!jobLog) {
      throw new RpcException(
        new NotFoundException(`JobLog with ID ${id} not found`),
      );
    }
    return jobLog;
  }

  // Delete a job log
  async remove(id: string): Promise<JobLog> {
    try {
      const jobLog = await this.database.jobLog.findUnique({
        where: { id },
      });

      if (!jobLog) {
        throw new RpcException(
          new NotFoundException(`JobLog with ID ${id} not found`),
        );
      }

      return await this.database.jobLog.delete({
        where: { id },
      });
    } catch (error) {
      throw new RpcException(
        new BadRequestException('Failed to delete job log'),
      );
    }
  }
}
