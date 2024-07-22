import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT_API_APP || 8000;
  const logger = new Logger('api-gateway');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () =>
    logger.log(
      `⚡️ [http] ready on port: ${port}, url: http://localhost:${port}`,
    ),
  );
}
bootstrap();
