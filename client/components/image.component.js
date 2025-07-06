import creator_api from "../api/creator.api.js";
import idol_api from "../api/idol.api.js";
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
async function createIdolAvatar(idol_id) {
      const idolAvatarimg = await idol_api.getIdolImagePath(idol_id);
      const avatar_source = `${app_configs.SERVER}/${ServerFolders.IDOLS}/${idolAvatarimg}`;
      const idol_avatar = await createAvatarFrame({ creator_id: idol_id, avatar_src: avatar_source, avatar_css: 'idol-image'});
      
      return idol_avatar;
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
async function createMangaThumbnail(manga) {
      const manga_wrapper = doms_component.createDiv('manga-wrapper');
      const manga_ahref = doms_component.createAhref({
            href: `manga/#id=${manga._id}`,
            css_class: 'manga-link'
      });

      const manga_src = `${app_configs.SERVER}/${ServerFolders.MANGAS}/${manga.thumbnail}`;
      const manga_thumbnail = images_component.createImg(manga_src, 'manga-thumbnail');
      
      manga_ahref.appendChild(manga_thumbnail);
      manga_wrapper.appendChild(manga_ahref);
      image_utils.addEffectHoverToZoomImage(manga_wrapper, manga_thumbnail);
      return manga_wrapper;
}
async function createImageFrame(image) {
      const image_wrapper = doms_component.createDiv('image-wrapper');
      const image_src = `${app_configs.SERVER}/${ServerFolders.IMAGES}/${image.image_url}`;
      const image_element = images_component.createImg(image_src, 'image-element');
      image_element.width = image.width / 2;
      image_element.height = image.height / 2;
      image_wrapper.appendChild(image_element);
      image_utils.addEffectHoverToZoomImage(image_wrapper, image_element);
      
      return image_wrapper;
}

const images_component = {
      createImg,
      createImgFromApi,
      createCreatorAvatar,
      HandleImageUpload,
      createMangaThumbnail,
      createImageFrame,
      createIdolAvatar,
}
export default images_component;