import { api_admin, api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import selectSearch_component from "../../components/select-search.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import file_utils from "../../utils/file.utils.js";
import string_utils from "../../utils/string.utils.js";
import tags_utils from "../../utils/tags.utils.js";
import { showToast } from "../../utils/toast-notification.js";

export function AdminShortController() {
      selectSearch_component.initSelectSearch('short-idol', api_user.getAllIdols, 'name');
      selectSearch_component.initSelectSearch('short-tag', api_user.getTagsByImages, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, 'short-tag');
      AwaitUploadShort();

      const form_btn = document.getElementById('short-form_submit');
      form_btn.addEventListener('click', async(event) => {
            event.preventDefault();
            const idol_id = selectSearch_component.getSelectedOptionValue('short-idol', 'id');
            const idol_name = selectSearch_component.getSelectedOptionValue('short-idol', 'text');
            const idol_identifiername = string_utils.RemoveAccents(idol_name);
            const tag_ids = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

            const short_file = document.getElementById('short-input').files[0];
            if(!short_file) {
                  showToast('Please upload a short before submitting');
                  return null;
            }
            const renamed_short = file_utils.renameUploadedFile(short_file, idol_identifiername);
            
            const form_data = new FormData();
            form_data.append("idol_id", idol_id);
            form_data.append("tag_ids", tag_ids);
            form_data.append("file", renamed_short);
            console.log('form data: ', form_data);

            try {
                  const result = await fetch_api.createForm(api_admin.createShort, form_data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  showToast('Short created', 'success');
                  ResetShortPreview();
            } catch(error) {
                  console.error('Error creating short: ', error.message);
                  showToast(error.message, 'error');
            }
      });
}

function AwaitUploadShort() {
      const thumbnail = document.getElementById('short-img');
      const upload_input = document.getElementById('short-input');

      thumbnail.addEventListener('click', () => {
            upload_input.click();
      });

      upload_input.addEventListener('change', HandleShortUpload);
}
function HandleShortUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'video/mp4') {
            const video_element  = document.querySelector('video');
            const source_element = video_element.querySelector('source');

            const thumbnail_image = document.getElementById('short-img');

            const video_url = URL.createObjectURL(file);
            source_element.src = video_url;
            video_element.load();
            video_element.classList.remove('d-none');
            thumbnail_image.style.display = 'none';
      } else {
            showToast('Please upload a valid mp4 video', 'error');
      }
}

function ResetShortPreview() {
      const video_element = document.querySelector('video');
      const source_element = video_element.querySelector('source');
      const thumbnail_image = document.getElementById('short-img');
      const upload_input = document.getElementById('short-input');

      source_element.src = "";
      video_element.load();

      video_element.classList.add('d-none');
      thumbnail_image.style.display = "";
      upload_input.value = "";
}