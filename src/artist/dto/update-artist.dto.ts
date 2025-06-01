import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateArtistInfoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
