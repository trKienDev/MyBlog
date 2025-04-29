import { playlist_dto } from "../dtos/playlist.dto.js";
import { iPlaylist } from "../models/interface/iplaylist.model.js";
import Playlist from "../models/playlist.model.js";
import { iPlaylistRepository } from "./interfaces/iplaylist.repository.js";

export class PlayLIstRepository implements iPlaylistRepository {
      public async getPlaylists(): Promise<playlist_dto[]> {
            const playlists = await Playlist.find();
            return playlists.map(playlist => mappingDocToDTO(playlist));
      }
      public async createPlaylist(data: string): Promise<playlist_dto> {
            const new_playlist = new Playlist({ name: data });
            const created_playlist = await new_playlist.save();
            return mappingDocToDTO(created_playlist);
      }
}

function mappingDocToDTO(doc: iPlaylist): playlist_dto {
      return {
            _id: doc.id.toString(),
            name: doc.name,
      }
}