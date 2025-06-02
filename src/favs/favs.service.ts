import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import { Fav } from './entities/fav.entity';

@Injectable()
export class FavsService {
  constructor(private readonly databaseService: DatabaseService) {}

  getFavorites(): FavoritesResponseDto {
    const favoriteIds: Fav = this.databaseService.getFavorites();

    const artists = favoriteIds.artists
      .map((id) => this.databaseService.getArtistById(id))
      .filter((artist) => artist !== undefined);

    const albums = favoriteIds.albums
      .map((id) => this.databaseService.getAlbumById(id))
      .filter((album) => album !== undefined);

    const tracks = favoriteIds.tracks
      .map((id) => this.databaseService.getTrackById(id))
      .filter((track) => track !== undefined);

    return {
      artists,
      albums,
      tracks,
    };
  }

  addTrackToFavorites(trackId: string): void {
    const track = this.databaseService.getTrackById(trackId);
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }
    this.databaseService.addTrackToFavorites(trackId);
  }

  removeTrackFromFavorites(trackId: string): void {
    const isRemoved = this.databaseService.removeTrackFromFavorites(trackId);
    if (!isRemoved) {
      throw new NotFoundException('Track is not in favorites');
    }
  }

  addAlbumToFavorites(albumId: string): void {
    const album = this.databaseService.getAlbumById(albumId);
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    this.databaseService.addAlbumToFavorites(albumId);
  }

  removeAlbumFromFavorites(albumId: string): void {
    const isRemoved = this.databaseService.removeAlbumFromFavorites(albumId);
    if (!isRemoved) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  addArtistToFavorites(artistId: string): void {
    const artist = this.databaseService.getArtistById(artistId);
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    this.databaseService.addArtistToFavorites(artistId);
  }

  removeArtistFromFavorites(artistId: string): void {
    const isRemoved = this.databaseService.removeArtistFromFavorites(artistId);
    if (!isRemoved) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }
}
