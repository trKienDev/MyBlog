import api_configs from "../api/api.config.js";
import css_selectors from "../selectors/css.selectors.js";
import video_utils from "../utils/video.utils.js";

function createTrWithId(id) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', id);
      return tr;
}

// Edit Cell
async function createEditBtn(editContainerClass, item, handleEditCallback) {
      const editCell = document.createElement('td');

      const editContainer = document.createElement('div');
      editContainer.classList.add(editContainerClass);

      const edit_button = document.createElement('button');
      edit_button.classList.add('btn');
      edit_button.classList.add('btn-edit');
      edit_button.setAttribute('type', 'button');
      edit_button.setAttribute('aria-label', `update ${item.name || item._id}`);
      edit_button.setAttribute('title', 'update');

      edit_button.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
      
      if(typeof handleEditCallback === 'function') {
            edit_button.onclick = () => handleEditCallback(item);
      }

      editCell.appendChild(edit_button);
      editContainer.appendChild(edit_button);
      editCell.appendChild(editContainer);

      return editCell;
}

// Delete cell
function createDeleteButtonCell(itemId, deleteClass, handleDeleteCallback) {
      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('div');
      deleteButton.classList.add(deleteClass);
      deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      deleteButton.onclick = () => handleDeleteCallback(itemId);
      deleteCell.appendChild(deleteButton);

      return deleteCell;
}

// Text
/**
 * Create <td> of text.
 *
 * @param {string} i_text – the text of td.
 * @param {string}  id – id of td
 * @param {string}   i_css – css class of td
 * @returns {Promise<HTMLTableCellElement>}
 */
function createTextTd({ i_text, i_id, i_css }) {
      const span = document.createElement('span');
      span.textContent = i_text;
      if(i_id) {
            span.setAttribute('data-id', i_id);
      }
      if(i_css) {
            span.classList.add(i_css);
      }

      const td = document.createElement('td');
      td.appendChild(span);
      return td;
}

// Image
function createImageTd(imgSrc, imgClass) {
      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = imgSrc;
      image.classList.add(imgClass);
      imageCell.appendChild(image);

      return imageCell;
}
/**
 * Create <td> of image, call API to get name of file.
 *
 * @param {Function} apiFn      – async function to get name of file  (ex: film_api.getFilmThumbnail)
 * @param {string}   id         – id to pass into apiFn
 * @param {string}   uploadPath – the subpath of `${api_configs.server}/uploads/`
 * @param {string}   cssClass   – class.css to apply <img> or <td> tuỳ impl
 * @returns {Promise<HTMLTableCellElement>}
 */
async function createImgTdFromApi({ apiFn, id, upload_path, css_class}) {
      const file_name = await apiFn(id);
      const src = `${api_configs.server}/uploads/${upload_path}/${file_name}`;
      return createImageTd(src, css_class);
}

// Video
function createVideoTd(video_url, css_class) {
      const video_cell = document.createElement('td');
      video_cell.classList.add(css_class);

      const video_container = document.createElement('div');
      video_container.classList.add(css_selectors.container.video_container);

      const video_src = document.createElement('source');
      video_src.src = video_url;
      video_src.type = 'video/mp4';

      let video_frame = document.createElement('video');
      video_frame.classList.add(css_selectors.videos.video_frame);
      video_frame.controls = false;
      video_frame.muted = true;
      video_frame = video_utils.hoverMouseToPlayVideo(video_frame);

      video_frame.appendChild(video_src);

      video_container.appendChild(video_frame);
      video_cell.appendChild(video_container);
      return video_cell;
}
/**
 * Create <td> of text.
 *
 * @param {string} ifile_path – file path of video.
 * @param {string} iupload_path - path of video folder in server
 * @param {string}  icss - class of video container div
 * @returns {Promise<HTMLTableCellElement>}
 */
async function createVideoTdFromApi({ ifile_path, iupload_path, icss }) {
      const video_url = `${api_configs.server}/uploads/${iupload_path}/${ifile_path}`;
      return createVideoTd(video_url, icss);
}

// Helper function
function clickToDisplayLargeImg(image, imgClass, imgWidth, imgHeight) {
      image.addEventListener('click', (e) => {
            e.stopPropagation();

            const existedImg = '.' + imgClass;
            // Kiểm tra xem largeImage đã tồn tại chưa
            if(document.querySelector(existedImg)) {
                  return;
            }

            const largeImage = document.createElement('img');
            largeImage.src = image.src;
            largeImage.classList.add(imgClass);
            largeImage.style.position = 'absolute';
            largeImage.style.top = `${e.clientY}px`;
            largeImage.style.left = `${e.clientX}px`;
            largeImage.style.width = imgWidth;
            largeImage.style.height = imgHeight;
            largeImage.style.zIndex = '1000';
            largeImage.style.border = 'none';

            document.body.appendChild(largeImage);

            // Add event listener to document for closing the enlarged image
            const closeLargeImage = () => {
                  if(document.body.contains(largeImage)) {
                        document.body.removeChild(largeImage);
                  }
                  document.removeEventListener('click', closeLargeImage);
            };

            // Delay adding the event listener to avoid immediate execution from the current click
            setTimeout(() => {
                  document.addEventListener('click', closeLargeImage);
            }, 0);
      });
}

const table_component = {
      createTrWithId,
      createEditBtn,
      createDeleteButtonCell,
      createTextTd,
      createImageTd,
      createImgTdFromApi,
      createVideoTd,
      createVideoTdFromApi,
      clickToDisplayLargeImg,
};
export default table_component;

