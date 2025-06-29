import image_api from "../../api/image.api.js";
import doms_component from "../../components/doms.component.js";
import images_component from "../../components/image.component.js";
import app_configs from "../../config/app.config.js";
import { ServerFolders } from "../../constants/folders.constant.js";
import image_utils from "../../utils/image.utils.js";

export async function HomepageImageSectionController() {
      const images = await image_api.GetAllImages();
      const homepageImagesSection = document.getElementById('homepage-images_section');
      const homepageImagesSectionWrapper = homepageImagesSection.querySelector('.homepage_images-section_wrapper');
      
      images.forEach(image => {
            const image_wrapper = doms_component.createDiv('idol-image_wrapper');
            const image_src = `${app_configs.SERVER}/${ServerFolders.IMAGES}/${image.image_url}`;
            const idol_image = images_component.createImg(image_src, 'idol-image');
            idol_image.width = image.width / 2;
            idol_image.height = image.height / 2;
            image_wrapper.appendChild(idol_image);
            image_utils.addEffectHoverToZoomImage(image_wrapper, idol_image);
            homepageImagesSectionWrapper.appendChild(image_wrapper);
      });
}