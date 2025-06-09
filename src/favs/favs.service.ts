import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFavorites(): Promise<FavoritesResponseDto> {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({ include: { artist: true } }),
      this.prisma.favoriteAlbum.findMany({ include: { album: true } }),
      this.prisma.favoriteTrack.findMany({ include: { track: true } }),
    ]);
    return {
      artists: artists.map((fav) => fav.artist),
      albums: albums.map((fav) => fav.album),
      tracks: tracks.map((fav) => fav.track),
    };
  }

  async addTrackToFavorites(trackId: string): Promise<void> {
    if (!uuidValidate(trackId)) {
      throw new NotFoundException('Invalid track ID format');
    }
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }
    await this.prisma.favoriteTrack.upsert({
      where: { trackId },
      update: {},
      create: { trackId },
    });
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    if (!uuidValidate(trackId)) {
      throw new NotFoundException('Invalid track ID format');
    }
    try {
      await this.prisma.favoriteTrack.delete({ where: { trackId } });
    } catch {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    if (!uuidValidate(albumId)) {
      throw new NotFoundException('Invalid album ID format');
    }
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    await this.prisma.favoriteAlbum.upsert({
      where: { albumId },
      update: {},
      create: { albumId },
    });
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    if (!uuidValidate(albumId)) {
      throw new NotFoundException('Invalid album ID format');
    }
    try {
      await this.prisma.favoriteAlbum.delete({ where: { albumId } });
    } catch {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  async addArtistToFavorites(artistId: string): Promise<void> {
    if (!uuidValidate(artistId)) {
      throw new NotFoundException('Invalid artist ID format');
    }
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    await this.prisma.favoriteArtist.upsert({
      where: { artistId },
      update: {},
      create: { artistId },
    });
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    if (!uuidValidate(artistId)) {
      throw new NotFoundException('Invalid artist ID format');
    }
    try {
      await this.prisma.favoriteArtist.delete({ where: { artistId } });
    } catch {
      throw new NotFoundException('Artist is not in favorites');
    }
  }
}
