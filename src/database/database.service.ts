// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service';
// import { User } from '../user/entities/user.entity';
// import { Artist } from '../artist/entities/artist.entity';
// import { Track } from '../track/entities/track.entity';
// import { Album } from '../album/entities/album.entity';

// @Injectable()
// export class DatabaseService {
//   constructor(private readonly prisma: PrismaService) {}

//   // ============= USER METHODS =============
//   async getUsers(): Promise<User[]> {
//     return this.prisma.user.findMany();
//   }

//   async getUserById(id: string): Promise<User | null> {
//     return this.prisma.user.findUnique({
//       where: { id },
//     });
//   }

//   async addUser(
//     userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
//   ): Promise<User> {
//     return this.prisma.user.create({
//       data: userData,
//     });
//   }

//   async updateUser(id: string, userData: Partial<User>): Promise<User> {
//     return this.prisma.user.update({
//       where: { id },
//       data: {
//         ...userData,
//         version: { increment: 1 }, // Увеличиваем версию при обновлении
//       },
//     });
//   }

//   async deleteUser(id: string): Promise<User> {
//     return this.prisma.user.delete({
//       where: { id },
//     });
//   }

//   // ============= ARTIST METHODS =============
//   async getArtists(): Promise<Artist[]> {
//     return this.prisma.artist.findMany();
//   }

//   async getArtistById(id: string): Promise<Artist | null> {
//     return this.prisma.artist.findUnique({
//       where: { id },
//     });
//   }

//   async addArtist(artistData: Omit<Artist, 'id'>): Promise<Artist> {
//     return this.prisma.artist.create({
//       data: artistData,
//     });
//   }

//   async updateArtist(id: string, artistData: Partial<Artist>): Promise<Artist> {
//     return this.prisma.artist.update({
//       where: { id },
//       data: artistData,
//     });
//   }

//   async deleteArtist(id: string): Promise<Artist> {
//     // Prisma автоматически обработает связи благодаря настройкам в schema
//     return this.prisma.artist.delete({
//       where: { id },
//     });
//   }

//   // ============= ALBUM METHODS =============
//   async getAlbums(): Promise<Album[]> {
//     return this.prisma.album.findMany({
//       include: {
//         artist: true, // Включаем информацию об артисте
//       },
//     });
//   }

//   async getAlbumById(id: string): Promise<Album | null> {
//     return this.prisma.album.findUnique({
//       where: { id },
//       include: {
//         artist: true,
//       },
//     });
//   }

//   async addAlbum(albumData: Omit<Album, 'id'>): Promise<Album> {
//     return this.prisma.album.create({
//       data: albumData,
//       include: {
//         artist: true,
//       },
//     });
//   }

//   async updateAlbum(id: string, albumData: Partial<Album>): Promise<Album> {
//     return this.prisma.album.update({
//       where: { id },
//       data: albumData,
//       include: {
//         artist: true,
//       },
//     });
//   }

//   async deleteAlbum(id: string): Promise<Album> {
//     return this.prisma.album.delete({
//       where: { id },
//     });
//   }

//   // ============= TRACK METHODS =============
//   async getTracks(): Promise<Track[]> {
//     return this.prisma.track.findMany({
//       include: {
//         artist: true,
//         album: true,
//       },
//     });
//   }

//   async getTrackById(id: string): Promise<Track | null> {
//     return this.prisma.track.findUnique({
//       where: { id },
//       include: {
//         artist: true,
//         album: true,
//       },
//     });
//   }

//   async addTrack(trackData: Omit<Track, 'id'>): Promise<Track> {
//     return this.prisma.track.create({
//       data: trackData,
//       include: {
//         artist: true,
//         album: true,
//       },
//     });
//   }

//   async updateTrack(id: string, trackData: Partial<Track>): Promise<Track> {
//     return this.prisma.track.update({
//       where: { id },
//       data: trackData,
//       include: {
//         artist: true,
//         album: true,
//       },
//     });
//   }

//   async deleteTrack(id: string): Promise<Track> {
//     return this.prisma.track.delete({
//       where: { id },
//     });
//   }

//   // ============= FAVORITES METHODS =============
//   async getFavorites() {
//     const [artists, albums, tracks] = await Promise.all([
//       this.prisma.favoriteArtist.findMany({
//         include: {
//           artist: true,
//         },
//       }),
//       this.prisma.favoriteAlbum.findMany({
//         include: {
//           album: {
//             include: {
//               artist: true,
//             },
//           },
//         },
//       }),
//       this.prisma.favoriteTrack.findMany({
//         include: {
//           track: {
//             include: {
//               artist: true,
//               album: true,
//             },
//           },
//         },
//       }),
//     ]);

//     return {
//       artists: artists.map((fav) => fav.artist),
//       albums: albums.map((fav) => fav.album),
//       tracks: tracks.map((fav) => fav.track),
//     };
//   }

//   // TRACK FAVORITES
//   async addTrackToFavorites(trackId: string): Promise<void> {
//     await this.prisma.favoriteTrack.upsert({
//       where: { trackId },
//       update: {}, // Если уже существует, ничего не делаем
//       create: { trackId },
//     });
//   }

//   async removeTrackFromFavorites(trackId: string): Promise<boolean> {
//     try {
//       await this.prisma.favoriteTrack.delete({
//         where: { trackId },
//       });
//       return true;
//     } catch (error) {
//       // Если запись не найдена, возвращаем false
//       return false;
//     }
//   }

//   // ALBUM FAVORITES
//   async addAlbumToFavorites(albumId: string): Promise<void> {
//     await this.prisma.favoriteAlbum.upsert({
//       where: { albumId },
//       update: {},
//       create: { albumId },
//     });
//   }

//   async removeAlbumFromFavorites(albumId: string): Promise<boolean> {
//     try {
//       await this.prisma.favoriteAlbum.delete({
//         where: { albumId },
//       });
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

//   // ARTIST FAVORITES
//   async addArtistToFavorites(artistId: string): Promise<void> {
//     await this.prisma.favoriteArtist.upsert({
//       where: { artistId },
//       update: {},
//       create: { artistId },
//     });
//   }

//   async removeArtistFromFavorites(artistId: string): Promise<boolean> {
//     try {
//       await this.prisma.favoriteArtist.delete({
//         where: { artistId },
//       });
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }
// }
