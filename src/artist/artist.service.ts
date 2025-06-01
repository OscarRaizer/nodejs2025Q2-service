import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistInfoDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createartistDto: CreateArtistDto) {
    if (!createartistDto.name || !createartistDto.grammy) {
      throw new BadRequestException('Name and Grammy status are required');
    }

    const newArtist: Artist = {
      id: uuidv4(),
      name: createartistDto.name,
      grammy: createartistDto.grammy,
    };

    this.databaseService.addArtist(newArtist);
    return newArtist;
  }

  findAll() {
    return this.databaseService.getArtists();
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const artist = this.databaseService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  update(id: string, dto: UpdateArtistInfoDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    if (dto.name === undefined && dto.grammy === undefined) {
      throw new BadRequestException(
        'At least one field (name or grammy) is required for update',
      );
    }

    if (dto.grammy !== undefined && typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Grammy must be a boolean value');
    }

    const artist = this.databaseService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist: Artist = {
      ...artist,
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.grammy !== undefined && { grammy: dto.grammy }),
    };

    this.databaseService.updateArtist(updatedArtist);
    return updatedArtist;
  }

  remove(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid artist ID format');
    }

    const artist = this.databaseService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    this.databaseService.deleteArtist(id);
  }
}
