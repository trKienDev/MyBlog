import { api_admin, api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import images_component from "../../components/image.component.js";
import selectSearch_component from "../../components/select-search.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import file_utils from "../../utils/file.utils.js";
import image_utils from "../../utils/image.utils.js";
import tags_utils from "../../utils/tags.utils.js";
import { showToast } from "../../utils/toast-notification.js";

export function AdminImageController() {
      selectSearch_component.initSelectSearch('image-tag', api_user.getTagsByImages, 'name');
      selectSearch_component.initSelectSearch('image-idol', api_user.getAllIdols, 'name');
      images_component.HandleImageUpload("image-img", "image-input");
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, 'image-tag');

      const form_btn = document.getElementById('image-form_submit');
      form_btn.addEventListener('click', async(event) => {
            event.preventDefault();
            const idol_id = selectSearch_component.getSelectedOptionValue('image-idol', 'id');
            const idol_name = selectSearch_component.getSelectedOptionValue('image-idol', 'text');
            const tag_ids = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);
            
            const image_file = document.getElementById('image-input').files[0];
            if(!image_file) {
                  showToast('Please upload an image before submitting');
                  return null;
            }
            const renamed_image = file_utils.renameUploadedFile(image_file, idol_name);
            
            const form_data = new FormData();
            form_data.append("idol_id", idol_id);
            form_data.append("tag_ids", tag_ids);
            form_data.append("file", renamed_image);

            try {
                  const result = await fetch_api.createForm(api_admin.createImage, form_data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  showToast('image created', 'success');
                  ResetImageModal();
            } catch(error) {
                  console.error('Error creating image: ', error.message);
                  showToast(error.message, 'error');
            }
      });
}

function ResetImageModal() {
      selectSearch_component.resetSelectSearch([
            { id: "image-tag", placeholder: "Select tag"},
            { id: "image-idol", placeholder: "Select idol"},
      ]);
      tags_utils.resetTagSelection(id_selectors.container.selected_tag);

      const img_id = "image-img";
      const imgInput_id = "image-input";
      const default_img = "/admin/static/images/face/upload-profile.jpg";
      image_utils.resetImageElementValue(img_id, imgInput_id, default_img);
}