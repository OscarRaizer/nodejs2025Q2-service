import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    if (
      createAlbumDto.artistId &&
      !(await this.prisma.artist.findUnique({
        where: { id: createAlbumDto.artistId },
      }))
    ) {
      throw new BadRequestException('Artist not found');
    }
    return await this.prisma.album.create({
      data: {
        id: uuidv4(),
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId || null,
      },
    });
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid Album ID');
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid Album ID');
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');

    if (
      updateAlbumDto.artistId !== undefined &&
      updateAlbumDto.artistId !== null &&
      !(await this.prisma.artist.findUnique({
        where: { id: updateAlbumDto.artistId },
      }))
    ) {
      throw new BadRequestException('Artist not found');
    }

    return await this.prisma.album.update({
      where: { id },
      data: {
        name: updateAlbumDto.name ?? album.name,
        year: updateAlbumDto.year ?? album.year,
        artistId:
          updateAlbumDto.artistId !== undefined
            ? updateAlbumDto.artistId
            : album.artistId,
      },
    });
  }

  async remove(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Invalid Album ID');
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    await this.prisma.album.delete({ where: { id } });
  }
}
