import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entity';

@Injectable()
export class DatabaseService {
  private database = {
    users: [] as User[],
    artists: [] as Artist[],
    albums: [] as Album[],
    tracks: [] as Track[],
    favorites: {
      artists: [] as string[],
      albums: [] as string[],
      tracks: [] as string[],
    },
  };
  // User
  getUsers(): User[] {
    return this.database.users;
  }

  getUserById(id: string): User | undefined {
    return this.database.users.find((user) => user.id === id);
  }

  addUser(user: User): void {
    this.database.users.push(user);
  }

  updateUser(user: User): void {
    const index = this.database.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.database.users[index] = user;
    }
  }

  deleteUser(id: string): void {
    this.database.users = this.database.users.filter((u) => u.id !== id);
  }
  // Artist
  getArtists(): Artist[] {
    return this.database.artists;
  }

  getArtistById(id: string): Artist | undefined {
    return this.database.artists.find((artist) => artist.id === id);
  }

  addArtist(artist: Artist): void {
    this.database.artists.push(artist);
  }

  updateArtist(artist: Artist): void {
    const index = this.database.artists.findIndex((a) => a.id === artist.id);
    if (index !== -1) {
      this.database.artists[index] = artist;
    }
  }

  deleteArtist(id: string): void {
    this.database.artists = this.database.artists.filter((a) => a.id !== id);

    this.database.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    this.database.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    this.database.favorites.artists = this.database.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }

  // Track
  getTracks(): Track[] {
    return this.database.tracks;
  }

  getTrackById(id: string): Track | undefined {
    return this.database.tracks.find((track) => track.id === id);
  }

  addTrack(track: Track): void {
    this.database.tracks.push(track);
  }

  updateTrack(track: Track): void {
    const index = this.database.tracks.findIndex((t) => t.id === track.id);
    if (index !== -1) {
      this.database.tracks[index] = track;
    }
  }

  deleteTrack(id: string): void {
    this.database.tracks = this.database.tracks.filter((t) => t.id !== id);
    // remove from fav
    this.database.favorites.tracks = this.database.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  // Album
  getAlbums(): Album[] {
    return this.database.albums;
  }

  getAlbumById(id: string): any | undefined {
    return this.database.albums.find((album) => album.id === id);
  }

  addAlbum(album: Album): void {
    this.database.albums.push(album);
  }

  updateAlbum(album: Album): void {
    const index = this.database.albums.findIndex((a) => a.id === album.id);
    if (index !== -1) {
      this.database.albums[index] = album;
    }
  }

  deleteAlbum(id: string): void {
    this.database.albums = this.database.albums.filter((a) => a.id !== id);
    // remove from fav
    this.database.favorites.albums = this.database.favorites.albums.filter(
      (albumId) => albumId !== id,
    );

    // add Null to album references in tracks
    this.database.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }
}
