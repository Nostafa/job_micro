import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user';
import { User } from '@prisma/client';
import { DatabaseService, PaginationDto } from '@app/shared';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  // Create a new user
  async create({ name, email }: CreateUserDto): Promise<{ message: string }> {
    await this.findUserByEmail(email);
    await this.database.user.create({ data: { name, email } });
    return { message: 'you create user successfully' };
  }

  // Find all users
  async findAll({ limit, page, sortOrder }: PaginationDto): Promise<User[]> {
    const skip = page * limit;
    return this.database.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: sortOrder },
    });
  }

  // Find a user by ID
  async findOne(id: string): Promise<User | null> {
    const user = this.database.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(`there is no user with id #${id}`);
    return user;
  }

  // Update a user
  async update(id: string, { name, email }: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    if (email) await this.findUserByEmail(email);
    return this.database.user.update({
      where: { id },
      data: { name, email },
    });
  }

  // Delete a user
  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.database.user.delete({
      where: { id },
    });

    return { message: `you successfully delete user with id ${id}` };
  }

  private async findUserByEmail(email: string) {
    const user = await this.database.user.findUnique({ where: { email } });
    if (user) throw new BadRequestException('this email is already exist');

    return user;
  }
}
