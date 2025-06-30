import { api_admin, api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import images_component from "../../components/image.component.js";
import selectSearch_component from "../../components/select-search.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import file_utils from "../../utils/file.utils.js";
import image_utils from "../../utils/image.utils.js";
import sort_utils from "../../utils/sort.utils.js";
import string_utils from "../../utils/string.utils.js";
import tags_utils from "../../utils/tags.utils.js";
import { showToast } from "../../utils/toast-notification.js";

let file_uploadedImages = [];

export function AdminImageController() {
      selectSearch_component.initSelectSearch('image-tag', api_user.getTagsByImages, 'name');
      selectSearch_component.initSelectSearch('image-idol', api_user.getAllIdols, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, 'image-tag');

      const form_btn = document.getElementById('image-form_submit');
      form_btn.addEventListener('click', async(event) => {
            AddImages(event);
      });

      UploadImages();
}

function ResetImageModal() {
      const img_id = "image-img";
      const imgInput_id = "image-input";
      const default_img = "/admin/static/images/face/upload-profile.jpg";
      image_utils.resetImageElementValue(img_id, imgInput_id, default_img);
}

async function AddImages(event) {
      event.preventDefault();

      const idol_id = selectSearch_component.getSelectedOptionValue('image-idol', 'id');
      const idol_name = selectSearch_component.getSelectedOptionValue('image-idol', 'text');
      const idol_identifiername = string_utils.RemoveAccents(idol_name);
      const tag_ids = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

      if(file_uploadedImages.length === 0) {
            showToast('Please upload an image before submitting');
            return null;
      }

      let count = 0;
      file_uploadedImages.forEach(async (file) => {
            count = count + 1;
            const renamed_image = file_utils.renameUploadedFile(file, idol_identifiername + `_img[${count}]`);
            const image_dimension = await image_utils.GetImageDimensions(renamed_image);

            const form_data = new FormData();
            form_data.append("idol_id", idol_id);
            form_data.append("tag_ids", tag_ids);
            form_data.append("width", image_dimension.width);
            form_data.append("height", image_dimension.height);
            form_data.append("file", renamed_image);
            console.log('form data: ', form_data);

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
                  return;
            }
      });
      
      // const image_file = document.getElementById('image-input').files[0];
      // if(!image_file) {
      //       showToast('Please upload an image before submitting');
      //       return null;
      // }
      // const renamed_image = file_utils.renameUploadedFile(image_file, idol_identifiername);
      // const image_dimension = await image_utils.GetImageDimensions(image_file);
      
}

function UploadImages() {
      const upload_images_div = document.getElementById('uploaded-images');
      const upload_images_btn = document.getElementById('upload-images_btn');
      const upload_images_input = document.getElementById('image-input');
      upload_images_btn.addEventListener('click', () => {
            upload_images_input.click();
      });

      upload_images_input.addEventListener('change', (event) => {
            const files = event.target.files;
            if(files && files.length > 0) {
                  const initial_array = Array.from(files);
                  const sorted_array = sort_utils.sortArrayByName(initial_array);
                  
                  file_uploadedImages = sorted_array;

                  sorted_array.forEach(file => {
                        const image_frame = CreateImgFrame(file);
                        upload_images_div.appendChild(image_frame);
                  });
            }
      });
}

function CreateImgFrame(file) {
      const image_frame = document.createElement('div');
      image_frame.classList.add('image-frame');

      const image_element = document.createElement('img');
      image_element.classList.add('image');

      image_element.src = URL.createObjectURL(file);
      image_element.onload = () => {
            URL.revokeObjectURL(image_element.src); 
      }

      image_frame.appendChild(image_element);
      return image_frame;
}