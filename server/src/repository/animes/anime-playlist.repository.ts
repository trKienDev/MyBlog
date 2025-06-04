import { AnimePlaylistDTO } from "../../dtos/animes/anime-playlist.dto.js";
import AnimePlaylist, { iAnimePlaylist } from "../../models/animes/anime-playlist.model.js";
import { iAnimePlaylistRepository } from "./interfaces/ianime-playlist.repository.js";

export class AnimePlaylistRepository implements iAnimePlaylistRepository {
      async getAnimePlaylists(): Promise<AnimePlaylistDTO[]> {
            const anime_playlists = await AnimePlaylist.find();
            return anime_playlists.map(playlist => mappingDocToDTO(playlist));
      }
      async getAnimePlaylistById(id: string): Promise<AnimePlaylistDTO | null> {
            const anime_playlist = await AnimePlaylist.findById(id);
            if(!anime_playlist) {
                  return null;
            }

            return mappingDocToDTO(anime_playlist);
      }
      async createAnimePlaylist(data: string): Promise<AnimePlaylistDTO> {
            const anime_playlist = new AnimePlaylist({ name: data });
            const created_animePlaylist = await anime_playlist.save();
            return mappingDocToDTO(created_animePlaylist);
      }
}

function mappingDocToDTO(doc: iAnimePlaylist): AnimePlaylistDTO {
      return {
            _id: doc.id.toString(),
            name: doc.name,
      }
}