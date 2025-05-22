import api_configs from "../api/api.config.js";
import selectSearch_component from "../components/select-search.component.js";
import id_selectors from "../selectors/element-id.selector.js";

async function getImgSourceFromApi(apiFn, id, upload_path, file_name) {
      const image = await apiFn(id);
      const img_src = `${api_configs.server}/uploads/${upload_path}/${file_name}`;
      return img_src;
}

function loadThumbnailOfSelectedFilm(ifilm, file_path) {
      const thumbnail_element = document.getElementById(id_selectors.thumbnail.thumbnail_image);
      thumbnail_element.src = `${api_configs.server}/${file_path}/${ifilm.thumbnail}`;
      thumbnail_element.alt = `${ifilm.name} thumbnail`;

      return thumbnail_element;
}

function displayThumbnailOfSelectedSearchFilm(element_id, upload_path, apiFn) {
      selectSearch_component.getClickedOptionValue(element_id, async function(clicked_id) {
            const selectedOption_id = clicked_id;
            const film = await apiFn(selectedOption_id);
            loadThumbnailOfSelectedFilm(film, upload_path);
      });
}

const image_utils = {
      loadThumbnailOfSelectedFilm,
      displayThumbnailOfSelectedSearchFilm,
      getImgSourceFromApi,
};
export default image_utils;