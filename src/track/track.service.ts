import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    if (
      createTrackDto.artistId &&
      !(await this.prisma.artist.findUnique({
        where: { id: createTrackDto.artistId },
      }))
    ) {
      throw new BadRequestException('Artist not found');
    }
    if (
      createTrackDto.albumId &&
      !(await this.prisma.album.findUnique({
        where: { id: createTrackDto.albumId },
      }))
    ) {
      throw new BadRequestException('Album not found');
    }
    return await this.prisma.track.create({
      data: {
        id: uuidv4(),
        name: createTrackDto.name,
        duration: createTrackDto.duration,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
      },
    });
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID format');
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID format');
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    if (
      updateTrackDto.artistId !== undefined &&
      updateTrackDto.artistId !== null &&
      !(await this.prisma.artist.findUnique({
        where: { id: updateTrackDto.artistId },
      }))
    ) {
      throw new BadRequestException('Artist not found');
    }
    if (
      updateTrackDto.albumId !== undefined &&
      updateTrackDto.albumId !== null &&
      !(await this.prisma.album.findUnique({
        where: { id: updateTrackDto.albumId },
      }))
    ) {
      throw new BadRequestException('Album not found');
    }

    return await this.prisma.track.update({
      where: { id },
      data: {
        ...(updateTrackDto.name !== undefined && { name: updateTrackDto.name }),
        ...(updateTrackDto.duration !== undefined && {
          duration: updateTrackDto.duration,
        }),
        artistId:
          updateTrackDto.artistId !== undefined
            ? updateTrackDto.artistId
            : track.artistId,
        albumId:
          updateTrackDto.albumId !== undefined
            ? updateTrackDto.albumId
            : track.albumId,
      },
    });
  }

  async remove(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid track ID format');
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    await this.prisma.track.delete({ where: { id } });
  }
}
