import { PlaylistDTO } from "../../dtos/playlist.dto";

export interface iPlaylistRepository {
      getPlaylists(): Promise<PlaylistDTO[]>;
      findById(id: string): Promise<PlaylistDTO | null>;
      createPlaylist(data: string): Promise<PlaylistDTO>;
}