import { playlist_dto } from "../../dtos/playlist.dto";

export interface iPlaylistRepository {
      getPlaylists(): Promise<playlist_dto[]>;
      createPlaylist(data: string): Promise<playlist_dto>;
}