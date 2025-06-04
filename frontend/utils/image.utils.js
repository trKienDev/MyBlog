import api_configs from "../api/api.config.js";
import selectSearch_component from "../components/select-search.component.js";
import css_class from "../constants/css.constant.js";
import id_selectors from "../selectors/element-id.selector.js";
import { showToast } from "./toast-notification.js";

async function getImageSourceFromApi(apiFn, id, upload_path) {
      const image_file = await apiFn(id);
      const img_source = `${api_configs.server}/${upload_path}/${image_file}`;
      return img_source;
}

function loadThumbnailOfSelectedFilm(ifilm, file_path) {
      const thumbnail_element = document.getElementById(id_selectors.thumbnail.thumbnail_image);
      thumbnail_element.src = `${api_configs.server}/${file_path}/${ifilm.thumbnail}`;
      thumbnail_element.alt = `${ifilm.name} thumbnail`;
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

function addEffectHoverToZoomImage(container_element, image_element) {
      if (!(container_element instanceof HTMLElement) || container_element.tagName !== 'DIV') {
            console.error('Error: container_element is not DIV HTML.');
            showToast('Error add effect hover to zoom image', 'error');
            return; 
      }
      if (!(image_element instanceof HTMLElement) || image_element.tagName !== 'IMG') {
            console.error('Error: image_element is not IMG HTML');
            return; 
      }

      container_element.classList.add(css_class.HOVER_CONTAINER_TO_ZOOM_IMG);
      image_element.classList.add(css_class.HOVER_TO_ZOOM_IMG);
}

const image_utils = {
      loadThumbnailOfSelectedFilm,
      displayThumbnailOfSelectedSearchFilm,
      getImageSourceFromApi,
      resetImageElementValue,
      addEffectHoverToZoomImage,
};
export default image_utils;