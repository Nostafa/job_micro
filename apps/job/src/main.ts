import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { HttpToRpcExceptionFilter, RabbitMQService } from '@app/shared';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('job_RMQ');
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  RabbitMQService.connectRabbitMQ({
    app,
    queueNameEnv: 'RABBITMQ_JOB_QUEUE',
    inheritAppConfig: true,
    logger,
  });
  app.startAllMicroservices().then(() => logger.log(`⚡️ service is ready`));
}
bootstrap();
