import {
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUUID('4')
  artistId?: string;

  @IsOptional()
  @IsUUID('4')
  albumId?: string;

  @IsInt()
  @Min(1)
  duration: number;
}
