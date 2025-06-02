import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: '1488',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password',
    example: '1234',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
