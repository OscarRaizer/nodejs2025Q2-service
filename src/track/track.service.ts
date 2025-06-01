import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from '../database/database.service';
import { Track } from 'src/track/entities/track.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track({
      id: uuidv4(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
    });

    this.databaseService.addTrack(newTrack);
    return this.toResponse(newTrack);
  }

  findAll(): Track[] {
    const tracks = this.databaseService.getTracks();
    return tracks.map((track) => this.toResponse(track));
  }

  findOne(id: string): Track {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const track = this.databaseService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return this.toResponse(track);
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    if (Object.keys(updateTrackDto).length === 0) {
      throw new BadRequestException(
        'At least one field is required for update',
      );
    }

    const track = this.databaseService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // if artist exists
    if (updateTrackDto.artistId !== undefined) {
      if (
        updateTrackDto.artistId &&
        !this.databaseService.getArtistById(updateTrackDto.artistId)
      ) {
        throw new BadRequestException('Artist not found');
      }
    }

    // if album exists
    if (updateTrackDto.albumId !== undefined) {
      if (
        updateTrackDto.albumId &&
        !this.databaseService.getAlbumById(updateTrackDto.albumId)
      ) {
        throw new BadRequestException('Album not found');
      }
    }

    const updatedTrack = new Track({
      ...track,
      ...(updateTrackDto.name !== undefined && { name: updateTrackDto.name }),
      ...(updateTrackDto.duration !== undefined && {
        duration: updateTrackDto.duration,
      }),
      ...(updateTrackDto.artistId !== undefined && {
        artistId: updateTrackDto.artistId || null,
      }),
      ...(updateTrackDto.albumId !== undefined && {
        albumId: updateTrackDto.albumId || null,
      }),
    });

    this.databaseService.updateTrack(updatedTrack);
    return this.toResponse(updatedTrack);
  }

  remove(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    const track = this.databaseService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    this.databaseService.deleteTrack(id);
  }

  private toResponse(track: Track): Track {
    return track;
  }
}
