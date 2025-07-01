import playlist_api from "../../api/playlist.api.js";
import doms_component from "../../components/doms.component.js";
import ClientSections from "../../constants/client-sections.constant.js";
import videoPagination_section from "../../sections/pagination-videos/pagination-videos.section.js";
import spa_renderHTML from "../../services/spa/render-html.js";

export async function PlaylistInforPageController(playlist_id) {
      const playlist_name = await playlist_api.getPlaylistName(playlist_id);
      const playlistName_div = document.getElementById('playlist-name');
      const playlistName_span = doms_component.createH3(playlist_name, 'playlist-name');
      playlistName_div.appendChild(playlistName_span);

      spa_renderHTML.loadContentFromUrl(
            ClientSections.NEWVIDEOS, 
            'playlist-videos', 
            () => videoPagination_section.PaginedVideosSectionController('videos-pagination_section', { playlist_ids: playlist_id })
      );
}