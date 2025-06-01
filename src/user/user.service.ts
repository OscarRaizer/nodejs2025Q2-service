import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    const newUser = new User({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    this.databaseService.addUser(newUser);
    return this.toResponse(newUser);
  }

  findAll() {
    const users = this.databaseService.getUsers();
    return users.map((user) => this.toResponse(user));
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.databaseService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toResponse(user);
  }

  update(id: string, dto: UpdateUserPasswordDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.databaseService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = new User({
      ...user,
      password: dto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    this.databaseService.updateUser(updatedUser);
    return this.toResponse(updatedUser);
  }

  remove(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.databaseService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.databaseService.deleteUser(id);
  }

  private toResponse(user: User) {
    return instanceToPlain(user);
  }
}
