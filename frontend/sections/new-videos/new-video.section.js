import creator_api from "../../api/creator.api.js";
import { film_api } from "../../api/film.api.js";
import { video_api } from "../../api/video.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import videos_component from "../../components/videos.component.js";    

export async function NewVideosSectionController() {
      const videos = await video_api.getVideos();
      const newVideos_div = document.querySelector('.new-videos');
      newVideos_div.innerHTML = '';

      const video_promises = videos.map(async (video) => {
            const video_article = await createVideoArticle(video);
            newVideos_div.appendChild(video_article);
      });

      await Promise.all(video_promises);
}

async function createVideoArticle(video) {
      let video_article = doms_component.createArticle('video-article');
      const videoArticle_container = doms_component.createDiv('video-article-container');
      
      let videoArticle_ahref = doms_component.createAhref({ href: `video/#id=${video._id}`, css_class: 'video-article-link'});
      videoArticle_container.appendChild(videoArticle_ahref);

      const video_container = videos_component.createVideoPlayer(video.name, video.file_path);
      videoArticle_ahref.appendChild(video_container);

      const videoInfo_div = await createVideoInfo(video);
      videoArticle_ahref.appendChild(videoInfo_div);

      video_article.appendChild(videoArticle_container);

      videoArticle_ahref = videos_component.hoverMouseVideoToPlay(videoArticle_ahref);

      return video_article;
}

async function createVideoInfo(video) {
      const videoInfo_div = doms_component.createDiv('video-info');
      const videoInfo_container = doms_component.createDiv('video-info-container');
      
      let video_creator = await images_component.createCreatorAvatar(video.creator_id);
      videoInfo_container.appendChild(video_creator);

      const video_film = await createInfor({
            ihref: video.film_id,
            itext: await film_api.getFilmNameById(video.film_id),
            icss_class: 'video-film',
            icontainer_css: 'video-film-container',
      })

      const video_creatorName = await createInfor({
            ihref: video.creator_id,
            itext: await creator_api.getCreatorName(video.creator_id),
            icss_class: 'video-creator',
            icontainer_css: 'video-creator-container',
      });

      const video_details = doms_component.createDiv('video-details');

      const video_views = doms_component.createSpan({ text: `${video.views} views`, css_class: 'video-views'});

      video_details.appendChild(video_film);
      video_details.appendChild(video_creatorName);
      video_details.appendChild(video_views);
      videoInfo_container.appendChild(video_details);
      videoInfo_div.appendChild(videoInfo_container);

      return videoInfo_div;
}

async function createInfor({ ihref, itext, icss_class, icontainer_css}) {
      const info = doms_component.createAhref({
            href: ihref,
            text: itext,
            css_class: icss_class,
      });
      const info_container = doms_component.createDiv(icontainer_css);
      info_container.appendChild(info);
      
      return info_container;
}
