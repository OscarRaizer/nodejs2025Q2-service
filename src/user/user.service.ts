import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  private usersDatabase: User[] = [];

  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    const newUser = new User({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    this.usersDatabase.push(newUser);
    return this.toResponse(newUser);
  }

  findAll() {
    return this.usersDatabase.map((user) => this.toResponse(user));
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.usersDatabase.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toResponse(user);
  }

  update(id: string, dto: UpdateUserPasswordDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    if (!dto.oldPassword || !dto.newPassword) {
      throw new BadRequestException('Old and new passwords are required');
    }

    const userIndex = this.usersDatabase.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    if (dto.oldPassword !== this.usersDatabase[userIndex].password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = new User({
      ...this.usersDatabase[userIndex],
      password: dto.newPassword,
      version: this.usersDatabase[userIndex].version + 1,
      updatedAt: Date.now(),
    });

    this.usersDatabase[userIndex] = updatedUser;
    return this.toResponse(updatedUser);
  }

  remove(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const userIndex = this.usersDatabase.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.usersDatabase.splice(userIndex, 1);
  }

  private toResponse(user: User) {
    return instanceToPlain(user);
  }
}
