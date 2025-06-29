import manga_api from "../../api/manga.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import app_configs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import image_utils from "../../utils/image.utils.js";

export async function HomepageMangasSectionController() {
      const homepage_mangas_section = document.getElementById('homepage-mangas_section');
      const home_page_mangas_section_wrapper = homepage_mangas_section.querySelector('.homepage_mangas-section_wrapper');
      
      const mangas = await manga_api.GetAllMangas();
      mangas.forEach(manga => {
            const manga_wrapper = doms_component.createDiv('manga-wrapper');

            const manga_ahref = doms_component.createAhref({
                  href: `manga/#id=${manga._id}`,
                  css_class: 'manga-link'
            });

            const manga_src = `${app_configs.SERVER}/${ServerFolders.MANGAS}/${manga.thumbnail}`;
            const manga_thumbnail = images_component.createImg(manga_src, 'manga-thumbnail');
            
            manga_ahref.appendChild(manga_thumbnail);
            manga_wrapper.appendChild(manga_ahref);
            image_utils.addEffectHoverToZoomImage(manga_wrapper, manga_thumbnail);
            home_page_mangas_section_wrapper.appendChild(manga_wrapper);
      });
}