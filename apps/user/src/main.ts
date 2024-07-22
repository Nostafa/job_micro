import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Logger } from '@nestjs/common';
import { HttpToRpcExceptionFilter, RabbitMQService } from '@app/shared';

async function bootstrap() {
  const logger = new Logger('user_RMQ');
  const app = await NestFactory.create(UserModule);
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  RabbitMQService.connectRabbitMQ({
    app,
    queueNameEnv: 'RABBITMQ_USER_QUEUE',
    inheritAppConfig: true,
    logger,
  });
  app.startAllMicroservices().then(() => logger.log(`⚡️ service is ready`));
}
bootstrap();
