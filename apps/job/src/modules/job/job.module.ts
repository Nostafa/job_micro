import { RabbitMQModule } from './../../../../../libs/shared/src/RabbitMQ/rmq.module';
import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { DatabaseModule, USER_SERVICE } from '@app/shared';
import { JobHealthIndicator } from './job.health';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RabbitMQModule,
    RabbitMQModule.registerRmq(USER_SERVICE, process.env.RABBITMQ_USER_QUEUE),
  ],
  controllers: [JobController],
  providers: [JobService, JobHealthIndicator],
})
export class JobModule {}
