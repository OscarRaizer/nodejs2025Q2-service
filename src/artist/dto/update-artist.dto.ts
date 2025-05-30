import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';

export class UpdateArtistInfoDto extends PartialType(CreateArtistDto) {}
