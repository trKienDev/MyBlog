import api_configs from "../api/api.config.js";
import selectSearch_component from "../components/select-search.component.js";
import id_selectors from "../selectors/element-id.selector.js";

async function getImageSourceFromApi(apiFn, id, upload_path) {
      const image_file = await apiFn(id);
      const img_source = `${api_configs.server}/${upload_path}/${image_file}`;
      return img_source;
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

function resetImageElementValue(id_img, id_imgInput, default_img) {
      const image = document.getElementById(id_img);
      const img_input = document.getElementById(id_imgInput);

      if(image) image.src = default_img || "/admin/static/images/studio/studio-upload.png";
      if(img_input) img_input.value = "";
}

function addHoverToZoomImage(img_container) {
      img_element.classList.add('hover-to-zoom-img');
      return img_container
}

const image_utils = {
      loadThumbnailOfSelectedFilm,
      displayThumbnailOfSelectedSearchFilm,
      getImageSourceFromApi,
      resetImageElementValue,
      addHoverToZoomImage,
};
export default image_utils;