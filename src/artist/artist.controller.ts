import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistInfoDto } from './dto/update-artist.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create artist' })
  @ApiResponse({ status: 201, description: 'Artist created successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request. Body does not contain required fields',
  })
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({ status: 200, description: 'Return all artists' })
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  @ApiParam({ name: 'id', description: 'Artist UUID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Return artist by id' })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist information' })
  @ApiParam({ name: 'id', description: 'Artist UUID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Artist updated successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistInfoDto,
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete artist' })
  @ApiParam({ name: 'id', description: 'Artist UUID', type: 'string' })
  @ApiNoContentResponse({ description: 'Artist deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }
}
