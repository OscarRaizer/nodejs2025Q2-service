import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistInfoDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class ArtistService {
  private artistsDatabase: Artist[] = [];

  create(createartistDto: CreateArtistDto) {
    if (!createartistDto.name || !createartistDto.grammy) {
      throw new BadRequestException('Name and Grammy status are required');
    }

    const newArtist: Artist = {
      id: uuidv4(),
      name: createartistDto.name,
      grammy: createartistDto.grammy,
    };

    this.artistsDatabase.push(newArtist);
    return newArtist;
  }

  findAll() {
    return this.artistsDatabase.map((artist) => artist);
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const artist = this.artistsDatabase.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('artist not found');
    }

    return artist;
  }

  update(id: string, dto: UpdateArtistInfoDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    if (!dto.name && !dto.grammy) {
      throw new BadRequestException(
        'At least one field (name or grammy) is required for update',
      );
    }

    if (dto.grammy !== undefined && typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Grammy must be a boolean value');
    }

    const artistIndex = this.artistsDatabase.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1) {
      throw new NotFoundException('artist not found');
    }

    const updatedArtist: Artist = {
      ...this.artistsDatabase[artistIndex],
      name: dto.name,
      grammy: dto.grammy,
    };

    this.artistsDatabase[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const artistIndex = this.artistsDatabase.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.artistsDatabase.splice(artistIndex, 1);
  }
}
