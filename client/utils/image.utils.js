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

/**
 * Lấy chiều rộng và chiều cao của một đối tượng File hình ảnh.
 * @param {File} file - Đối tượng File từ <input type="file">.
 * @returns {Promise<{width: number, height: number}>} Một Promise sẽ resolve với một object chứa width và height.
 */
function GetImageDimensions(file) {
      return new Promise((resolve, reject) => {
            // Kiểm tra xem file có phải là ảnh không
            if (!file.type.startsWith('image/')) {
                  reject(new Error('Tệp không phải là hình ảnh.'));
                  return;
            }

            // Tạo một URL tạm thời cho tệp tin
            const objectUrl = URL.createObjectURL(file);

            // Tạo một đối tượng Image mới trong bộ nhớ
            const img = new Image();

            // Lắng nghe sự kiện 'load' - sự kiện này chỉ được kích hoạt
            // KHI ảnh đã được tải xong và có thông tin về kích thước.
            img.onload = function() {
                  // Lấy width và height từ đối tượng image
                  const dimensions = {
                        width: this.width,
                        height: this.height
                  };

                  // Giải phóng bộ nhớ bằng cách thu hồi object URL
                  URL.revokeObjectURL(objectUrl);

                  // Trả về kết quả thành công
                  resolve(dimensions);
            };

            // Xử lý lỗi nếu không tải được ảnh
            img.onerror = function() {
                  URL.revokeObjectURL(objectUrl);
                  reject(new Error('Không thể tải tệp hình ảnh.'));
            };

            // Gán URL của tệp cho thuộc tính src của image để bắt đầu quá trình tải
            img.src = objectUrl;
      });
}

const image_utils = {
      loadThumbnailOfSelectedFilm,
      displayThumbnailOfSelectedSearchFilm,
      getImageSourceFromApi,
      resetImageElementValue,
      addEffectHoverToZoomImage,
      GetImageDimensions,
};
export default image_utils;