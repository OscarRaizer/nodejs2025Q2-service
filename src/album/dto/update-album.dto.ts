import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @ApiPropertyOptional({
    example: 'Vol2',
    description: 'Updated album name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 2021,
    description: 'Updated release year',
  })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({
    example: null,
    description: 'Artist ID (set to null to remove association)',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;
}
