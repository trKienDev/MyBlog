import animes_api from "../../api/anime.api.js";
import doms_component from "../../components/doms.component.js";
import videos_component from "../../components/videos.component.js";
import { ServerFolders } from "../../constants/folders.constant.js";

export async function HomepageAnimeVideosSectionController() {
      const listAnimeVideosSection = document.getElementById('anime-videos_section');
      const listAnimeVideoSection_wrapper = listAnimeVideosSection.querySelector('.anime-videos_section-wrapper');
      const anime_videos = await animes_api.GetUniqueVideosPagination();
      anime_videos.forEach(anime_video => {
            const video_frame = doms_component.createDiv('anime-video_frame');
            const video_container = doms_component.createDiv('anime-video_container');
            let video_ahref = doms_component.createAhref({href: `anime-video/#id=${anime_video._id}`, css_class: 'anime-video-link'});
            const video_player = videos_component.CreateVideoPlayer(anime_video.name, anime_video.file_path, ServerFolders.ANIME_VIDEOS, 'video-frame');
            video_ahref.appendChild(video_player);
            video_container.appendChild(video_ahref);
            video_frame.appendChild(video_container);

            video_ahref = videos_component.hoverMouseVideoToPlay(video_ahref);
            listAnimeVideoSection_wrapper.appendChild(video_frame);
      });
}