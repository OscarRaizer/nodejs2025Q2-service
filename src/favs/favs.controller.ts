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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: 200,
    description: 'Get all favorites artists, albums and tracks',
    type: FavoritesResponseDto,
  })
  async getFavorites(): Promise<FavoritesResponseDto> {
    return await this.favsService.getFavorites();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiParam({ name: 'id', description: 'Track UUID', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Track added to favorites successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Track with id doesn't exist",
  })
  async addTrackToFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.favsService.addTrackToFavorites(id);
    return { message: 'Track added to favorites successfully' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiParam({ name: 'id', description: 'Track UUID', type: 'string' })
  @ApiNoContentResponse({
    description: 'Track deleted from favorites successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Track was not found in favorites' })
  async removeTrackFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favsService.removeTrackFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiParam({ name: 'id', description: 'Album UUID', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Album added to favorites successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Album with id doesn't exist",
  })
  async addAlbumToFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.favsService.addAlbumToFavorites(id);
    return { message: 'Album added to favorites successfully' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiParam({ name: 'id', description: 'Album UUID', type: 'string' })
  @ApiNoContentResponse({
    description: 'Album deleted from favorites successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Album was not found in favorites' })
  async removeAlbumFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favsService.removeAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiParam({ name: 'id', description: 'Artist UUID', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Artist added to favorites successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Artist with id doesn't exist",
  })
  async addArtistToFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.favsService.addArtistToFavorites(id);
    return { message: 'Artist added to favorites successfully' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiParam({ name: 'id', description: 'Artist UUID', type: 'string' })
  @ApiNoContentResponse({
    description: 'Artist deleted from favorites successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Artist was not found in favorites' })
  async removeArtistFromFavorites(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.favsService.removeArtistFromFavorites(id);
  }
}
