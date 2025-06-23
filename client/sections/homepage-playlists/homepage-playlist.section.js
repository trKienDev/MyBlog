import playlist_api from "../../api/playlist.api.js";
import doms_component from "../../components/doms.component.js";

export async function HomepagePlaylistSectionController() {
      const homepagePlaylists_section = document.getElementById('homepage-playlists_section');
      const homepagePlaylistsSection_container = homepagePlaylists_section.querySelector('.section-wrapper');
      homepagePlaylistsSection_container.innerHTML = '';

      const playlists = await playlist_api.GetPlaylists();
      playlists.forEach(playlist => {
            const playlist_div = doms_component.createDiv('playlist-wrapper');
            playlist_div.classList.add('tag-item');
            const playlist_ahref = doms_component.createAhref({
                  href: `playlist/#id=${playlist._id}`,
                  text: playlist.name,
                  css_class: 'playlist-link',
            });
            playlist_ahref.classList.add('tag-link');
            playlist_div.appendChild(playlist_ahref);
            homepagePlaylistsSection_container.appendChild(playlist_div);
      });
}