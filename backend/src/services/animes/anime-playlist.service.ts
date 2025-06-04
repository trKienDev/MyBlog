import { IncomingMessage } from "http";
import { parseJSON } from "../../middlewares/json-parser.js";
import { iAnimePlaylistRepository } from "../../repository/animes/interfaces/ianime-playlist.repository.js";

export class AnimePlaylistService {
      private animePlaylist_repository: iAnimePlaylistRepository;
      constructor(AnimePlaylistRepository: iAnimePlaylistRepository) {
            this.animePlaylist_repository = AnimePlaylistRepository;
      }

      async createAnimePlaylist(req: IncomingMessage) {
            const required_params = ['name'];
            const body = await parseJSON(req, required_params);
            const { name } = body;
            if(!name) {
                  throw new Error('param name in createAnimePlaylist not found');
            }

            const new_animePlaylist = await this.animePlaylist_repository.createAnimePlaylist(name);
            return new_animePlaylist;
      }
}