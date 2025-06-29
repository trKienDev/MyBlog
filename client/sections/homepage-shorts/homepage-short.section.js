import short_api from "../../api/short.api.js";
import doms_component from "../../components/doms.component.js";
import videos_component from "../../components/videos.component.js";
import app_configs from "../../config/app.config.js";
import css_class from "../../constants/css.constant.js";
import { ServerFolders } from "../../constants/folders.constant.js";

export async function HomepageShortsSectionController() {
      const shorts = await short_api.GetAllShorts();
      const homepage_short = document.getElementById('homepage-shorts_container');
      shorts.forEach(short => {
            const short_article = CreateShortArticle(short.file_path);
            homepage_short.appendChild(short_article);
      });
}

function CreateShortArticle(short_filepath) {
      let short_article = doms_component.createArticle('short-article');
      const shortArticle_container = doms_component.createDiv('short-article-container');

      let short_container = doms_component.createDiv('short-container');
      let short_frame = CreateShortPreview('short-preview');
      const short_source = CreateShortSource(`${app_configs.SERVER}/${ServerFolders.SHORTS}/${short_filepath}`);
      short_frame.appendChild(short_source);
      short_container.appendChild(short_frame);
      short_container = videos_component.hoverMouseVideoToPlay(short_container);
      shortArticle_container.appendChild(short_container);
      short_article.appendChild(shortArticle_container);    
      return short_article;
}

function CreateShortPreview(css_class) {
      const short = document.createElement('video');
      short.classList.add(css_class);
      short.controls = false;
      short.muted - true;

      return short;
}
function CreateShortSource(file_path) {
      const source = document.createElement('source');
      source.src = file_path;
      source.type = 'video/mp4';
      return source;
}