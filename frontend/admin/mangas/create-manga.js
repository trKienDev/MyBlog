import api_configs from "../../api/api.config.js";
import fetch_api from "../../api/fetch.api.js";
import selectSearch_component from "../../components/select-search.component.js";
import thumbnail_component from "../../components/thumbnail.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import sort_utils from "../../utils/sort.utils.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import tags_utils from "../../utils/tags.utils.js";

let uploadedImageFiles = [];

export function initCreateMangaAdmin() {
      selectSearch_component.initSelectSearch(id_selectors.manga.manga_tag, api_configs.endpoints.getMangaTags, 'tag');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, id_selectors.manga.manga_tag);
      thumbnail_component.uploadThumbnail(id_selectors.thumbnail.thumbnail_image, id_selectors.thumbnail.thumbnail_upload, id_selectors.buttons.create_manga);
      uploadMangaImages();
      createManga();
}

function createManga() {
      const mangaNameInput = document.getElementById('name'); 
      const createManga_btn = document.getElementById('create-manga_btn');
      createManga_btn.addEventListener('click', async(event) => {
            event.preventDefault();
            
            const manga_info = collectMangaInfo(mangaNameInput);
            const manga_form = buildMangaForm(manga_info);
            console.log('manga form: ', manga_form);

            try {
                  const result = await fetch_api.createForm(api_configs.endpoints.initializeManga, manga_form);
                  if(result.success == false) {
                        throw new Error(result.error);
                  }
                  console.log(result.data._id);

                  success_sweetAlert('manga created');
                  resetMangaForm();
            } catch(error) {
                  console.error('Error creating manga: ', error);
                  error_sweetAlert(error);
            }
      });
}

function uploadMangaImages() {
      const createManga_section = document.getElementById('create-manga');
      const updloadImage_list = createManga_section.querySelector('.upload-images_list');
      const uploadImages_btn = document.getElementById('upload-images_btn');
      const uploadFile_input = document.getElementById('upload-images');
      uploadImages_btn.addEventListener('click', () => {
            uploadFile_input.click();

      });

      uploadFile_input.addEventListener('change', (event) => {
            const files = event.target.files;
            if(files && files.length > 0) {
                  const initial_array = Array.from(files);
                  const sorted_array = sort_utils.sortArrayByName(initial_array);

                  uploadedImageFiles = sorted_array;

                  sorted_array.forEach(file => { 
                        const image_frame = createImageFrame(file);
                        updloadImage_list.appendChild(image_frame);
                  });
            }
      });
}

function createImageFrame(file) {
      const image_frame = document.createElement('div');
      image_frame.classList.add('image-frame');

      const manga_image = document.createElement('img');
      manga_image.classList.add('manga-image');

      manga_image.src = URL.createObjectURL(file);
      manga_image.onload = () => {
            URL.revokeObjectURL(manga_image.src); 
      }

      image_frame.appendChild(manga_image);
      return image_frame;
}

function collectMangaInfo(mangaNameInput) {
      const name = mangaNameInput.value.trim();
      if (!name) {
            error_sweetAlert('Please name this manga!'); 
            return; 
      }

      const thumbnail = document.getElementById(id_selectors.thumbnail.thumbnail_upload).files[0];
      if(!thumbnail) {
            error_sweetAlert('Please upload a thumbnail before submitting');
            return null;
      }
      
      const description = document.getElementById('manga-description').value; 
      const tags = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);
      
      if(uploadedImageFiles.length == 0) {
            error_sweetAlert('Please upload images');
            return;
      }

      return { name, description, thumbnail, tags, uploadedImageFiles };
}

function buildMangaForm(manga_info) {
      const form_data = new FormData();
      form_data.append('name', manga_info.name);
      form_data.append('description', manga_info.description);
      form_data.append('file', manga_info.thumbnail);
      form_data.append('tag_ids', manga_info.tags);
      // manga_info.uploadedImageFiles.forEach(file => {
      //       form_data.append('file', file);
      // });
      
      return form_data;
}

function resetMangaForm() {
      document.getElementById('name').value = '';
      document.getElementById('manga-description').value = ''
      tags_utils.resetTagSelection(id_selectors.container.selected_tag);
      const createManga_section = document.getElementById('create-manga');
      createManga_section.querySelector('.upload-images_list').innerHTML = '';
}