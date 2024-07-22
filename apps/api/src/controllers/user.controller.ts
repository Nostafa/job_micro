import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  PaginationDto,
  sendMessagePipeException,
  USER_SERVICE,
} from '@app/shared';
import { ClientRMQ } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/user/src/dto/create.user';
import { UpdateUserDto } from 'apps/user/src/dto/update-user.dto';
import { UserMessagePattern } from 'apps/user/src/user.pattern';

@Controller('user')
export class UserController {
  constructor(@Inject(USER_SERVICE) private readonly userService: ClientRMQ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return sendMessagePipeException({
      client: this.userService,
      pattern: UserMessagePattern.insertUser,
      data: { ...createUserDto },
    });
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return sendMessagePipeException({
      client: this.userService,
      pattern: UserMessagePattern.findAllUsers,
      data: query,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return sendMessagePipeException({
      client: this.userService,
      pattern: UserMessagePattern.findUserById,
      data: { id },
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return sendMessagePipeException({
      client: this.userService,
      pattern: UserMessagePattern.updateUser,
      data: { id, ...updateUserDto },
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return sendMessagePipeException({
      client: this.userService,
      pattern: UserMessagePattern.removeUser,
      data: { id },
    });
  }
}
