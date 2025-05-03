import { PlaylistDTO } from "../dtos/playlist.dto.js";
import { iPlaylist } from "../models/interface/iplaylist.model.js";
import Playlist from "../models/playlist.model.js";
import { iPlaylistRepository } from "./interfaces/iplaylist.repository.js";

export class PlayLIstRepository implements iPlaylistRepository {
      public async getPlaylists(): Promise<PlaylistDTO[]> {
            const playlists = await Playlist.find();
            return playlists.map(playlist => mappingDocToDTO(playlist));
      }
      async findById(id: string): Promise<PlaylistDTO | null> {
            const playlist = await Playlist.findById(id);
            return playlist ? mappingDocToDTO(playlist) : null;
      }
      public async createPlaylist(data: string): Promise<PlaylistDTO> {
            const new_playlist = new Playlist({ name: data });
            const created_playlist = await new_playlist.save();
            return mappingDocToDTO(created_playlist);
      }
}

function mappingDocToDTO(doc: iPlaylist): PlaylistDTO {
      return {
            _id: doc.id.toString(),
            name: doc.name,
      }
}