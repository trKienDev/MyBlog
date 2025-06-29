import { api_admin } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import idol_api from "../../api/idol.api.js";
import images_component from "../../components/image.component.js";
import file_utils from "../../utils/file.utils.js";
import image_utils from "../../utils/image.utils.js";
import string_utils from "../../utils/string.utils.js";
import { showToast } from "../../utils/toast-notification.js";

export async function AdminIdolsController() {
      const idols = await idol_api.GetAllIdols();
      images_component.HandleImageUpload("idol-image", "img-input");
      
      const form_btn = document.getElementById('idol-form_submit');
      form_btn.addEventListener('click', async(event) => {
            event.preventDefault(); 

            const idol_name = document.getElementById('idol-name');
            const idol_identifiername = document.getElementById('idol-username').value;
            const idol_avatar = document.getElementById('img-input').files[0];
            const renamedIdolAvatar = file_utils.renameUploadedFile(idol_avatar, idol_identifiername);
            const idol_region = document.getElementById('idol-region');

            const form_data = new FormData();
            form_data.append("name", idol_name.value);
            form_data.append("identifier_name", idol_identifiername);
            form_data.append("file", renamedIdolAvatar);
            if(idol_region.value) {
                  form_data.append("region", idol_region.value);
            }
            console.log('form: ', form_data);
            try {
                  const result = await fetch_api.createForm(api_admin.createIdol, form_data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  showToast('idol created', 'success');
            } catch(error) {
                  console.error('Error creating idol: ', error);
                  showToast(error, 'error');
            } finally {
                  ResetModal(idol_name, idol_region);
            }
            
      });
}

function ResetModal(idol_name, idol_region) {
      idol_name.value = '';
      idol_region.value = '';
      const img_id = "idol-image";
      const imgInput_id = "img-input";
      const default_img = "/admin/static/images/face/upload-profile.jpg";
      image_utils.resetImageElementValue(img_id, imgInput_id, default_img);

}