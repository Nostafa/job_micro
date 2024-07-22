import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import {
  FormatResponseMiddleware,
  JOB_SERVICE,
  RabbitMQModule,
  ResponseExceptionFilter,
  USER_SERVICE,
} from '@app/shared';
import { ListControllers } from './controllers';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitMQModule,
    RabbitMQModule.registerRmq(USER_SERVICE, process.env.RABBITMQ_USER_QUEUE),
    RabbitMQModule.registerRmq(JOB_SERVICE, process.env.RABBITMQ_JOB_QUEUE),
  ],
  controllers: [...ListControllers],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ResponseExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FormatResponseMiddleware).forRoutes('*');
  }
}
