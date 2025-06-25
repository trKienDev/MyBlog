import creator_api from "../api/creator.api.js";
import app_configs from "../config/app.config.js";
import css_class from "../constants/css.constant.js";
import { ServerFolders } from "../constants/folders.constant.js";
import image_utils from "../utils/image.utils.js";
import doms_component from "./doms.component.js";

function HandleImageUpload(imageElementId, fileInputElementId) {
      const imageElement = document.getElementById(imageElementId);
      const fileInput = document.getElementById(fileInputElementId);

      imageElement.addEventListener("click", function() {
            fileInput.click();
      });

      fileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                  const reader = new FileReader();
                  reader.onload = function(e) {
                        imageElement.src = e.target.result; 
                  };
                  reader.readAsDataURL(file);
            }
      });
}

function createImg(img_src, css_class) {
      const image = document.createElement('img');
      if(img_src) image.src = img_src;
      if(css_class) image.classList.add(css_class);
      
      return image;
}

async function createImgFromApi({api_function, id, upload_path, css_class}) {
      const image_source = await image_utils.getImageSourceFromApi(api_function, id, upload_path);
      return createImg(image_source, css_class);
}

async function createCreatorAvatar(creator_id) {
      const creatorAvatar_img = await creator_api.getCreatorImg(creator_id);
      const avatar_source = `${app_configs.SERVER}/${ServerFolders.CREATOR_AVATARS}/${creatorAvatar_img}`;
      const creator_avatar = await createAvatarFrame({ creator_id: creator_id, avatar_src: avatar_source, avatar_css: css_class.CREATOR_IMAGE});
      
      return creator_avatar;
}

async function createAvatarFrame({ creator_id, avatar_src, avatar_css }) {
      const avatar_frame = doms_component.createDiv('avatar-frame');
      const avatarFrame_container = doms_component.createDiv('avatar-frame_container');
      
      const avatar_image = await createImg(avatar_src, avatar_css);
      const creator_ahref = doms_component.createAhref({
            href: `creator/#id=${creator_id}`,
      });
      creator_ahref.appendChild(avatar_image);
      avatarFrame_container.appendChild(creator_ahref);
      image_utils.addEffectHoverToZoomImage(avatarFrame_container, avatar_image);
      avatar_frame.appendChild(avatarFrame_container);

      return avatar_frame;
}


const images_component = {
      createImg,
      createImgFromApi,
      createCreatorAvatar,
      HandleImageUpload
}
export default images_component;