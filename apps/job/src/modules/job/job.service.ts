import { DatabaseService, USER_SERVICE } from '@app/shared';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto, UpdateJobDto } from './dto';
import { Job } from '@prisma/client';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { UserMessagePattern } from 'apps/user/src/user.pattern';

@Injectable()
export class JobService {
  constructor(
    private readonly database: DatabaseService,
    @Inject(USER_SERVICE) private readonly userService: ClientRMQ,
  ) {}

  // Create a new job
  async create({ name, description, userId }: CreateJobDto): Promise<Job> {
    const findUser = this.userService.send(UserMessagePattern.findUserById, {
      id: userId,
    });
    if (!findUser) {
      throw new RpcException(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    }
    return this.database.$transaction(async (prisma) => {
      const job = await prisma.job.create({
        data: { name, description, userId },
      });

      await prisma.jobLog.create({
        data: {
          jobId: job.id,
          status: 'Created',
          message: 'Job created successfully',
        },
      });

      return job;
    });
  }

  // Find all jobs
  async findAll(): Promise<Job[]> {
    return this.database.job.findMany();
  }

  // Find a job by ID
  async findOne(id: string): Promise<Job | null> {
    const job = await this.database.job.findUnique({
      where: { id },
    });
    if (!job) {
      throw new RpcException(
        new NotFoundException(`Job with ID ${id} not found`),
      );
    }
    return job;
  }

  // Update a job
  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    try {
      return await this.database.$transaction(async (prisma) => {
        const job = await prisma.job.findUnique({
          where: { id },
          include: { logs: { select: { status: true } } },
        });

        if (!job) {
          throw new NotFoundException(`Job with ID ${id} not found`);
        }

        const updatedJob = await prisma.job.update({
          where: { id },
          data: updateJobDto,
        });

        if (
          updateJobDto.status &&
          !job.logs.some((log) => updateJobDto.status == log.status)
        ) {
          await prisma.jobLog.create({
            data: {
              jobId: updatedJob.id,
              status: updateJobDto.status,
              message: `Job status updated to ${updateJobDto.status}`,
              timestamp: new Date(),
            },
          });
        }

        return updatedJob;
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException(error);
      }
      throw new RpcException(new BadRequestException('Failed to update job'));
    }
  }

  // Delete a job
  async remove(id: string): Promise<Job> {
    try {
      return await this.database.$transaction(async (prisma) => {
        const job = await prisma.job.findUnique({
          where: { id },
        });

        if (!job) {
          throw new NotFoundException(`Job with ID ${id} not found`);
        }

        const deletedJob = await prisma.job.delete({
          where: { id },
        });

        await prisma.jobLog.create({
          data: {
            jobId: deletedJob.id,
            status: 'Deleted',
            message: 'Job deleted successfully',
            timestamp: new Date(),
          },
        });

        return deletedJob;
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw new RpcException(error);
      }
      throw new RpcException(new BadRequestException('Failed to delete job'));
    }
  }
}
