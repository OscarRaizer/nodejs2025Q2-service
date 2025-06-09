import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User login',
    example: 'john_doe',
  })
  login: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'User version',
    example: 1,
  })
  version: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: 1640995200000,
  })
  createdAt: number;

  @ApiProperty({
    description: 'Last update timestamp',
    example: 1640995200000,
  })
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
