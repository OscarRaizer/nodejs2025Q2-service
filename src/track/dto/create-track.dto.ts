import {
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({
    example: 'Mamma Maria',
    description: 'Track name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: '390cbe23-e4c9-43e6-828d-7795833cad90',
    description: 'Optional artist ID (UUID v4)',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  artistId?: string;

  @ApiPropertyOptional({
    example: '390cbe23-e4c9-43e6-828d-7795833cad90',
    description: 'Optional album ID (UUID v4)',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  albumId?: string;

  @ApiProperty({
    example: 200,
    description: 'Duration in seconds (integer > 0)',
  })
  @IsInt()
  @Min(1)
  duration: number;
}
