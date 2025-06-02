import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from 'src/album/entities/album.entity';
import { DatabaseService } from '../database/database.service';

import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
@Injectable()
export class AlbumService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new Album({
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    });

    this.databaseService.addAlbum(newAlbum);
    return this.toResponse(newAlbum);
  }

  findAll(): Album[] {
    return this.databaseService
      .getAlbums()
      .map((album) => this.toResponse(album));
  }

  findOne(id: string): Album {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid Album ID');

    const album = this.databaseService.getAlbumById(id);
    if (!album) throw new NotFoundException('Album not found');

    return this.toResponse(album);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid Album ID');

    const album = this.databaseService.getAlbumById(id);
    if (!album) throw new NotFoundException('Album not found');

    // Validate exists artist if provided
    if (
      updateAlbumDto.artistId &&
      !this.databaseService.getArtistById(updateAlbumDto.artistId)
    ) {
      throw new BadRequestException('Artist not found');
    }

    const updatedAlbum = new Album({
      ...album,
      name: updateAlbumDto.name ?? album.name,
      year: updateAlbumDto.year ?? album.year,
      artistId:
        updateAlbumDto.artistId !== undefined
          ? updateAlbumDto.artistId
          : album.artistId,
    });

    this.databaseService.updateAlbum(updatedAlbum);
    return this.toResponse(updatedAlbum);
  }

  remove(id: string): void {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid Album ID');

    if (!this.databaseService.getAlbumById(id)) {
      throw new NotFoundException('Album not found');
    }

    this.databaseService.deleteAlbum(id);
  }

  private toResponse(album: Album): Album {
    return album;
  }
}
