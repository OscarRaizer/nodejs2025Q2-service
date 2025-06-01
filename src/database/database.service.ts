import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';

@Injectable()
export class DatabaseService {
  private database = {
    users: [] as User[],
    artists: [] as Artist[],
    albums: [] as any[],
    tracks: [] as any[],
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
  }
}
