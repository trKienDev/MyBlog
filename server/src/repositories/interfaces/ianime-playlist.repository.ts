import { AnimePlaylistDTO } from "../../../dtos/anime-playlist.dto.js";

export interface iAnimePlaylistRepository {
      getAnimePlaylists(): Promise<AnimePlaylistDTO[]>;
      getAnimePlaylistById(id: string): Promise<AnimePlaylistDTO | null>;
      createAnimePlaylist(name: string): Promise<AnimePlaylistDTO>;
}