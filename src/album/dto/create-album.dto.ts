import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateAlbumDto {
  @ApiProperty({
    example: 'Vol1',
    description: 'Album name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 2020,
    description: 'Release year',
  })
  @IsNumber()
  year: number;

  @ApiPropertyOptional({
    example: '1a848183-5265-4af1-9a82-048695e31b0b',
    description: 'Optional artist ID (UUID v4)',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  artistId?: string;
}
