import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtistInfoDto {
  @ApiPropertyOptional({
    example: 'Eminem',
    description: 'Updated artist name',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Updated Grammy award status',
  })
  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
