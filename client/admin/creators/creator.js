import api_configs from "../../api/api.config.js";
import { error_sweetAlert, success_sweetAlert } from "../../utils/sweet-alert.js";
import modal_component from "../../components/modal.component.js";
import { HandleImageUpload } from "../../components/image.component.js";
import  table_component from "../../components/table.component.js";
import fetch_api from "../../api/fetch.api.js";
import css_selectors from "../../selectors/css.selectors.js";
import creator_api from "../../api/creator.api.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import file_utils from "../../utils/file.utils.js";
import selectSearch_component from "../../components/select-search.component.js";
import { api_user } from "../../api/endpoint.api.js";
import tags_utils from "../../utils/tags.utils.js";
import css_class from "../../constants/css.constant.js";
import tag_api from "../../api/tag.api.js";

let formId = "creator-form";
let imgId = "img";
let imgInputId = "image-upload";
let modalId = "creator-modal";
let tableBody = "#creator-table tbody";
let defaultImg = "/admin/static/images/face/upload-profile.jpg";

const { initModal, resetModal } = modal_component;

export function initCreatorAdmin() {
      RenderCreators(tableBody);
      createNewCreator();
      initModal("open-modal_button", "close-modal_button", modalId, () => resetModal(formId, imgId, imgInputId, defaultImg ));
      HandleImageUpload("img", "image-upload");
      selectSearch_component.initSelectSearch('creator-tags', api_user.getTagsByCreator, 'name');
      tags_utils.displaySelectedTag(css_class.SELECTED_TAG_CONTAINER, css_class.SELECTED_TAG, 'creator-tags');
}

async function RenderCreators(element) {
      try {
            const creators = await creator_api.getCreators();
            const tbody = document.querySelector(element);
            tbody.innerHTML = '';

            creators.forEach(async (creator) => {
                  const tr = document.createElement('tr');
                  tr.setAttribute('data-id', creator._id);

                  const editBtn = await table_component.createEditBtn(css_selectors.container.edit_container, creator, updateCreator);
                  tr.appendChild(editBtn);

                  const name = table_component.createTextTd({ i_text: creator.name });
                  tr.appendChild(name);

                  const imgSrc = `${api_configs.server}/${ServerFolders.CREATOR_AVATARS}/${creator.image}`;
                  const image = table_component.createImageTd(imgSrc, 'profile');
                  tr.appendChild(image);

                  tbody.appendChild(tr); 
            });
      } catch(error) {
            console.error('Error loading creators: ', error);
            error_sweetAlert(error);
      }
}

async function createNewCreator() {
      const { form, modal, imgInput, image } = getELement();
      const resetOptions = { form, image, imgInput, modal, defaultImg };

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData();

            const creator_name = document.getElementById('creator-name').value;
            const creator_birth = document.getElementById('creator-birth').value;
            const creator_views = document.getElementById('creator-views').value;
            const creator_status = document.getElementById('creator-active').value;
            const creator_image = document.getElementById('image-upload').files[0];
            const renamed_image = file_utils.renameUploadedFile(creator_image, creator_name);
            const creator_tags = tags_utils.getSelectedTags('creator-tags', css_class.SELECTED_TAG);
            formData.append("name", creator_name);
            formData.append("birth", creator_birth);
            formData.append("file", renamed_image);
            formData.append("view", creator_views);
            formData.append("status", creator_status);
            formData.append("tag_ids", creator_tags);

            try {
                  const result = await fetch_api.createForm(api_configs.endpoints.createCreator, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert('Creator created');
            } catch(error) {
                  console.error('Error creating creator in client: ', error);
                  error_sweetAlert(error);
            } finally {
                  modal.style.display = "none";
                  RenderCreators(tableBody);
                  resetModal(resetOptions);
            }
      }
}

async function updateCreator(creator) {
      console.log('creator: ', creator);
      const { form, modal, imgInput, image } = getELement();
      
      const resetOptionss = { form, image, imgInput, modal, defaultImg};
      const closeBtn = document.getElementById("closeModalButton");
      if(closeBtn) {
            closeBtn.onclick = () => resetModal(resetOptionss);
      }

      modal.style.display = 'block';

      document.getElementById("creator-name").value = creator.name || "";
      document.getElementById("creator-birth").value = creator.birth ? new Date(creator.birth).toISOString().split("T")[0] : "";
      document.getElementById("creator-views").value = String(creator.views) || "";
      image.src = creator.image ? `${api_configs.server}/${ServerFolders.CREATOR_AVATARS}/${creator.image}` : defaultImg;
      if(creator.active === true) {
            document.getElementById('creator-active').value = 'active';
      } else {
            document.getElementById('creator-active').value = 'deactive';
      }
      const selectTag_container = document.getElementById(css_class.SELECTED_TAG_CONTAINER);
      selectTag_container.innerHTML = '';
      await tags_utils.renderSelectedTags(creator.tag_ids, selectTag_container, tag_api.getTagById);

      form.onsubmit = async(event) => {
            event.preventDefault();

            const formData = new FormData();
            const creator_name = document.getElementById('creator-name').value;
            formData.append("name", creator_name);

            const creator_birth = document.getElementById('creator-birth').value;
            formData.append("birth", creator_birth);

            const creator_image = document.getElementById('image-upload').files[0];
            if(creator_image) {
                  const renamed_image = file_utils.renameUploadedFile(creator_image, creator_name);
                  formData.append("file", renamed_image);
            }

            const creator
            
            try {
                  const result = await fetch_api.updateForm(`${api_configs.endpoints.updateCreator}/${creator._id}`, formData);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  success_sweetAlert("creator updated");
                  RenderCreators(tableBody);
            } catch(error) {
                  console.error("Error updating creator in client: ", error);
                  error_sweetAlert(error);
            } finally {
                  modal.style.display = "none";
                  resetModal(resetOptionss);
            }
      };
}

function getELement() {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const image = document.getElementById("img");

      return { form, modal, imgInput, image };
}
