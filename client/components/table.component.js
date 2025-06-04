import api_configs from "../api/api.config.js";
import css_selectors from "../selectors/css.selectors.js";
import image_utils from "../utils/image.utils.js";
import video_utils from "../utils/video.utils.js";
import images_component from "./image.component.js";
import videos_component from "./videos.component.js";

function createTrWithId(id, css_class) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', id);
      tr.classList.add(css_class);
      return tr;
}

// Edit Cell
async function createEditBtn(editContainerClass, item, handleEditCallback) {
      const edit_td = document.createElement('td');

      const edit_container = document.createElement('div');
      edit_container.classList.add(editContainerClass);

      const edit_button = document.createElement('button');
      edit_button.classList.add('btn');
      edit_button.classList.add(css_selectors.button.light_btn);
      edit_button.setAttribute('type', 'button');
      edit_button.setAttribute('aria-label', `update ${item.name || item._id}`);
      edit_button.setAttribute('title', 'update');

      edit_button.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
      
      if(typeof handleEditCallback === 'function') {
            edit_button.onclick = () => handleEditCallback(item);
      }

      edit_td.appendChild(edit_button);
      edit_container.appendChild(edit_button);
      edit_td.appendChild(edit_container);

      return edit_td;
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
      const text_container = document.createElement('div');
      text_container.classList.add('text-container');
      text_container.style.display = 'flex';
      text_container.style.justifyContent = 'center';
      const span = document.createElement('span');
      span.textContent = i_text;
      if(i_id) {
            span.setAttribute('data-id', i_id);
      }
      if(i_css) {
            span.classList.add(i_css);
      }
      text_container.appendChild(span);

      const td = document.createElement('td');
      td.appendChild(text_container);
      return td;
}

// Image
function createImageTd(img_source, css_class) {
      const imageCell = document.createElement('td');
      const image = images_component.createImg(img_source, css_class);
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
      const image_source = await image_utils.getImageSourceFromApi(apiFn, id, upload_path);
      return createImageTd(image_source, css_class);
}

// Video
function createVideoTd(video_url, css_class) {
      const video_cell = document.createElement('td');
      video_cell.classList.add(css_class);

      const video_container = document.createElement('div');
      video_container.classList.add(css_selectors.container.video_container);

      let video_frame = videos_component.createVideoPreview(css_selectors.videos.video_frame);
      video_frame = video_utils.clickMouseToPlayVideo(video_frame);

      const video_src = videos_component.createVideoSource(video_url);

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

/**
 * Creates a table cell (td) containing a checkbox.
 * This function encapsulates the creation of the selection part of a table row.
 * @returns {{td: HTMLTableCellElement, checkbox: HTMLInputElement}} An object containing the created td and checkbox.
 */
function createSelectCheckboxTd(css_class) {
      const select_td = document.createElement('td');
      select_td.classList.add(css_class);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      select_td.appendChild(checkbox);

      return { td: select_td, checkbox };
}


/**
 * Binds click event listeners to a film table row for selection.
 * It handles the selection logic (checking/unchecking, adding/removing 'selected' class).
 * A callback function is executed after a row is successfully selected.
 * @param {HTMLTableRowElement} tr - The table row element.
 * @param {HTMLInputElement} checkbox - The checkbox element within the row.
 * @param {object} film - The film object associated with the row.
 * @param {function} onRowSelectedCallback - Callback function to execute after a row is selected. It receives the film object.
 * @returns {HTMLTableRowElement} The table row with event listeners bound.
 */
function handleTrSelection(table, tr, checkbox, film, onRowSelectedCallback) {
      tr.addEventListener('click', () => {
            const is_selected = tr.classList.contains('selected');

            document.querySelectorAll(`#${table} tbody input[type="checkbox"]`)
                  .forEach(cb => cb.checked = false);

            document.querySelectorAll(`#${table} tbody tr`)
                  .forEach(r => r.classList.remove('selected'));

            if (!is_selected) {
                  checkbox.checked = true;
                  tr.classList.add('selected');

                  if (typeof onRowSelectedCallback === 'function') {
                        onRowSelectedCallback(film);
                  }
            } else {
                  // If the row was already selected and is clicked again,
                  // it means it was deselected by the general deselect-all logic above.
                  // To re-select it, we explicitly set it here.
                  // However, if the intention is to toggle off selection on a second click
                  // on an already selected row, this part needs adjustment.
                  // For now, it re-selects. If a toggle-off is desired,
                  // the callback should perhaps only be called if !is_selected.
                  // Based on the original logic, clicking an already selected row would re-select it
                  // and re-trigger the thumbnail load.
                  checkbox.checked = true; // Ensure checkbox is checked
                  tr.classList.add('selected'); // Ensure 'selected' class is present
                  if (typeof onRowSelectedCallback === 'function') {
                        console.log('run');
                        onRowSelectedCallback(film); // Call callback again if re-selected
                  }
            }
      });

      return tr;
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
      createSelectCheckboxTd,
      handleTrSelection,

};
export default table_component;



