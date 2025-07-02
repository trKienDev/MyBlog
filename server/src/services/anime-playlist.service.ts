import { IncomingMessage } from "http";
import { parseJSON } from "../middlewares/json-parser.js";
import { iAnimePlaylistRepository } from "../repositories/interfaces/ianime-playlist.repository.js";

export default class AnimePlaylistService {
      private _animePlaylistRepository: iAnimePlaylistRepository;
      constructor(animePlaylistRepository: iAnimePlaylistRepository) {
            this._animePlaylistRepository = animePlaylistRepository;
      }

      async createAnimePlaylist(request: IncomingMessage) {
            const required_params = ['name'];
            const body = await parseJSON(request, required_params);
            const { name } = body;
            if(!name) {
                  throw new Error('param name in createAnimePlaylist not found');
            }

            const new_animePlaylist = await this._animePlaylistRepository.createAnimePlaylist(name);
            return new_animePlaylist;
      }
}