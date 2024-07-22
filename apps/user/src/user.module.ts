import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule, RabbitMQModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { UserHealthIndicator } from './user.health';

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [UserController],
  providers: [UserService, UserHealthIndicator],
})
export class UserModule {}
