import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user';
import { PaginationDto, RabbitMQService } from '@app/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserHealthIndicator } from './user.health';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserMessagePattern } from './user.pattern';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rabbitMqService: RabbitMQService,
    private readonly userHealthIndicator: UserHealthIndicator,
  ) {}

  @MessagePattern(UserMessagePattern.isHealthy)
  async isHealthy(
    @Ctx() context: RmqContext,
    @Payload() { key }: { key: string },
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.userHealthIndicator.isHealthy(key);
  }

  @MessagePattern(UserMessagePattern.insertUser)
  async insertUser(
    @Ctx() context: RmqContext,
    @Payload() createUserDto: CreateUserDto,
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.userService.create(createUserDto);
  }

  @MessagePattern(UserMessagePattern.findAllUsers)
  async findAll(@Ctx() context: RmqContext, @Payload() query: PaginationDto) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.userService.findAll(query);
  }

  @MessagePattern(UserMessagePattern.findUserById)
  async findOne(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.userService.findOne(id);
  }

  @MessagePattern(UserMessagePattern.updateUser)
  async update(
    @Ctx() context: RmqContext,
    @Payload() body: UpdateUserDto & { id: string },
  ) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.userService.update(body.id, body);
  }

  @MessagePattern(UserMessagePattern.removeUser)
  async remove(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.rabbitMqService.acknowledgeMessage(context);
    return this.userService.remove(id);
  }
}
