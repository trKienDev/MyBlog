import { IncomingMessage } from "http";
import { iPlaylistRepository } from "../repository/interfaces/iplaylist.repository.js";
import { parseJSON } from "../middlewares/json-parser.js";

export class PlaylistService {
      private playlist_repo: iPlaylistRepository;
      constructor(playlistRepository: iPlaylistRepository) {
            this.playlist_repo = playlistRepository;
      } 

      public async createPlaylist(req: IncomingMessage) {
            const required_param = ['name'];
            const body = await parseJSON(req, required_param);

            const { name } = body;
            if(!name) {
                  throw new Error('param name in createPlay not found');
            }

            const new_playlist = await this.playlist_repo.createPlaylist(name);
            return new_playlist;
      }

}