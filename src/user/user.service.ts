import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
      },
    });

    return new User({
      ...userData,
      createdAt: userData.createdAt.getTime(),
      updatedAt: userData.updatedAt.getTime(),
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(
      (user) =>
        new User({
          ...user,
          createdAt: user.createdAt.getTime(),
          updatedAt: user.updatedAt.getTime(),
        }),
    );
  }

  async findOne(id: string): Promise<User> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const userData = await this.prisma.user.findUnique({ where: { id } });
    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return new User({
      ...userData,
      createdAt: userData.createdAt.getTime(),
      updatedAt: userData.updatedAt.getTime(),
    });
  }

  async update(id: string, dto: UpdateUserPasswordDto): Promise<User> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUserData = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });

    return new User({
      ...updatedUserData,
      createdAt: updatedUserData.createdAt.getTime(),
      updatedAt: updatedUserData.updatedAt.getTime(),
    });
  }

  async remove(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
