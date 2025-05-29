import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class UserService {
  private usersDatabase: User[] = [];

  create(createUserDto: CreateUserDto) {
    const newUser: User = {
      id: uuidv4(),
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.usersDatabase.push(newUser);
    return newUser;
  }

  findAll() {
    return this.usersDatabase;
  }

  findOne(id: string) {
    const user = this.usersDatabase.find((user) => user.id === id);
    // 400
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    // 404
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = this.usersDatabase.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      this.usersDatabase[userIndex] = {
        ...this.usersDatabase[userIndex],
        ...updateUserDto,
        version: this.usersDatabase[userIndex].version + 1,
        updatedAt: Date.now(),
      };
      return this.usersDatabase[userIndex];
    }
    return null;
  }

  remove(id: string) {
    const userIndex = this.usersDatabase.findIndex((user) => user.id === id);

    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.usersDatabase.splice(userIndex, 1);
    return 'User was successfully deleted';
  }
}
