import api_configs from "../../api/api.config.js";
import fetch_api from "../../api/fetch.api.js";
import modal_component from "../../components/modal.component.js";
import selectSearch_component from "../../components/select-search.component.js";
import table_component from "../../components/table.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import FolderUploads from "../../selectors/upload-folder-name.js";
import spa_navigation from "../../services/spa/navigate-link.spa.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import table_utils from "../../utils/table.utils.js";
import { showToast } from "../../utils/toast-notification.js";
import { initCreateMangaAdmin } from "./create-manga.js";

export async function initMangaAdmin() {
      spa_navigation.navigateLink(id_selectors.buttons.create_manga, id_selectors.section.dynamic_section, api_configs.endpoints.adminCreateMangaPage, initCreateMangaAdmin );
      modal_component.initModal(id_selectors.modal.open_button, id_selectors.modal.close_button, id_selectors.modal.manga_tag, modal_component.resetModal(id_selectors.form.manga_tag));
      createMangaTag();
      renderMangaList();
}

async function renderMangaList() {
      try {
            const result = await fetch_api.apiGet(api_configs.endpoints.getMangas);
            if(result.success === false) {
                  throw new Error(result.error);
            }
            const mangas = result.data;
            
            const tbody = table_utils.getTableTbody(id_selectors.table.mangas_table);
            tbody.innerHTML = '';
            console.log('mangas: ', mangas);
            mangas.forEach(async(manga) => {
                  const tr = table_component.createTrWithId(manga._id);

                  const td_name = table_component.createTextTd({ i_text: manga.name});
                  tr.appendChild(td_name);

                  const manga_thumbnail = `${api_configs.server}/${FolderUploads.MANGAS}/${manga.thumbnail}`;
                  const td_thumbnail = table_component.createImageTd(manga_thumbnail, 'manga-thumbnail'); 
                  tr.appendChild(td_thumbnail);

                  tbody.appendChild(tr);
            });
      } catch(error) {
            console.error('Error rendering mangas');
            showToast(error, 'error');
      }

}

async function createMangaTag() {
      try {
            const mangaTag_form = document.getElementById(id_selectors.modal.manga_tag);
            mangaTag_form.addEventListener('submit', async(event) => {
                  event.preventDefault();
                  const tag = document.getElementById('tag').value;
                  const data = { tag: tag };
                  const result = await fetch_api.createJson(`${api_configs.endpoints.createMangaTag}`, data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  modal_component.resetModal(id_selectors.form.manga_tag);
                  modal_component.closeModal(id_selectors.modal.manga_tag);
                  success_sweetAlert("manga tag created");
            });
      } catch(error) {
            console.error('Error creating manga tag');
            error_sweetAlert(error);
      }
}

