import manga_api from "../../api/manga.api.js";
import images_component from "../../components/image.component.js";

export async function HomepageMangasSectionController() {
      const homepage_mangas_section = document.getElementById('homepage-mangas_section');
      const home_page_mangas_section_wrapper = homepage_mangas_section.querySelector('.homepage_mangas-section_wrapper');
      
      const mangas = await manga_api.GetAllMangas();
      mangas.forEach(async (manga) => {
            const manga_wrapper = await images_component.createMangaThumbnail(manga);
            home_page_mangas_section_wrapper.appendChild(manga_wrapper);
      });
}