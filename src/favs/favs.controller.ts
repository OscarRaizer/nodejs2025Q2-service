import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  getFavorites(): FavoritesResponseDto {
    return this.favsService.getFavorites();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id', ParseUUIDPipe) id: string): {
    message: string;
  } {
    this.favsService.addTrackToFavorites(id);
    return { message: 'Track added to favorites successfully' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id', ParseUUIDPipe) id: string): void {
    this.favsService.removeTrackFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id', ParseUUIDPipe) id: string): {
    message: string;
  } {
    this.favsService.addAlbumToFavorites(id);
    return { message: 'Album added to favorites successfully' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id', ParseUUIDPipe) id: string): void {
    this.favsService.removeAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id', ParseUUIDPipe) id: string): {
    message: string;
  } {
    this.favsService.addArtistToFavorites(id);
    return { message: 'Artist added to favorites successfully' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(@Param('id', ParseUUIDPipe) id: string): void {
    this.favsService.removeArtistFromFavorites(id);
  }
}
