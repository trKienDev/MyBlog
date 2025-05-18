import { AnimePlaylistDTO } from "../../../dtos/animes/anime-playlist.dto.js";

export interface iAnimePlaylistRepository {
      getAnimePlaylists(): Promise<AnimePlaylistDTO[]>;
      getAnimePlaylistById(id: string): Promise<AnimePlaylistDTO | null>;
      createAnimePlaylist(name: string): Promise<AnimePlaylistDTO>;
}